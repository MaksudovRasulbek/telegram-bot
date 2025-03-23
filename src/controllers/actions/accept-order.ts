import mongoose from "mongoose";
import { ENV } from "../../constants";
import DRIVERS from "../../schemas/drivers";
import ORDERS from "../../schemas/orders";
import { BotCtx } from "../../types/context";
import handlerProvider, { getPercent } from "../../utils/functions";


const handler = async(ctx: BotCtx) =>{
    const driver  = await DRIVERS.aggregate([
        {$match:{chatId: ctx.from.id}},
        {$lookup:{from: "qq_taxi_users",localField: "chatId",foreignField: "chatId",as: "users"}},
        {$addFields: {user: { $arrayElemAt: ["$users", 0] }}},
        {$project: {users: 0}}
    ]);

    if(!driver.length || (driver.length && !driver[0]?.user)){
        await ctx.answerCbQuery("Siz haydovchi emassiz!",{show_alert: true});
        return
    }
    const data = ctx.update.callback_query.data.split("_")[2];
    const orderValue = await ORDERS.aggregate([
        {$match:{_id: new mongoose.Types.ObjectId(data)}},
        {$lookup:{from: "qq_taxi_users",localField: "userId",foreignField: "chatId",as: "users"}},
        {$addFields: {user: { $arrayElemAt: ["$users", 0] }}},
        {$project: {users: 0}}
    ]);

    if(!orderValue.length || (orderValue.length && !orderValue[0]?.user)){
        await ctx.answerCbQuery("Buyurtmaga tegishli ma'lumotlar bilan muammo yuzaga keldi iltimos birozdan so'ng urinib ko'ring",{show_alert: true});
        return
    }
    const order = orderValue[0]
    if(order && order.status === "pending"){
        const orderPricePercent = getPercent(order.summa, order.summa >= 20000 ? ENV.minPercent : ENV.percent);
        if(driver[0].balance < orderPricePercent){
            await ctx.answerCbQuery(`Buyurtmani qabul qilish uchun pulingiz yetarli emas, sizga yana ${orderPricePercent - driver[0].balance} so'm kerak`,{show_alert: true});
            await ctx.telegram.sendMessage(ctx.from.id, `Sizning ID raqamingiz ${ctx.from.id}\n\nBalansingizda ${driver[0].balance} so'm\n\nBalansni to'ldirish uchun quyidagi raqamga o'tkazing: \n- Click raqam: <code>+998 91 406 63 39</code> (Abdurahmon S.)\n\nQuyidagi Chekni yuborish tugmasiga o'ting va transfer chekini va ushbu ID ${ctx.from.id} ni menejerga yuboring`,{
                reply_markup:{
                    inline_keyboard:[[{text:"📄 Chekni yuborish", url: ENV.adminUrl}]]
                },
                parse_mode:"HTML"
            })
            return
        }
        
        await DRIVERS.findOneAndUpdate({chatId: ctx.from.id},{$inc:{balance: -orderPricePercent}});
        await ORDERS.findByIdAndUpdate(data,{driverId: ctx.from.id, status:"accepted"});
        
        await ctx.editMessageText(`---🟢 QABUL QILINDI ---\n\nQayerdan: ${order.from}\nQayerga: ${order.to}\nNarxi: ${order.summa}\n\nMa'lumotlar Haydovchiga yuborildi.\n\nQabul qildi: ${driver[0].user.name}`);

        await ctx.telegram.sendMessage(ctx.from.id, `---🟢 YANGI BUYURTMA---\n\nQayerdan: ${order.from}\nQayerga: ${order.to}\nNarxi: ${order.summa}\n\nTelefon: ${order.user.phone}`,{
            reply_markup:{
                inline_keyboard:[ [{text:"Kutib turibman", callback_data:`waiting_${order._id}`},{text:"Buyurtmachi profili", url: `https://t.me/${order.user.phone}`}]]
            }
        })

        await ctx.telegram.sendMessage(order.userId, `---🟢 BUYURTMA QABUL QILINDI---\n\n<b>Qayerdan:</b> ${order.from}\n<b>Qayerga:</b> ${order.to}\n<b>Narxi:</b> ${order.summa}\n<b>Telefon:</b> ${order.user.phone}\n\n<b>---Haydovchi---</b>\n<b>Ismi:</b> ${driver[0].user.name}\n<b>Telefon:</b> ${driver[0].user.phone}\n<b>Mashina rusumi:</b> ${driver[0].carModel}\n<b>Mashina raqami:</b> ${driver[0].carNumber}`,{
            parse_mode:"HTML"
        })
    }
}

const acceptOrder = ctx => handlerProvider(ctx, handler);
export default acceptOrder