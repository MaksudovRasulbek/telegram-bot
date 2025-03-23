import mongoose from "mongoose";
import ORDERS from "../../schemas/orders";
import { BotCtx } from "../../types/context";
import DRIVERS from "../../schemas/drivers";
import handlerProvider from "../../utils/functions";


const handler = async(ctx: BotCtx) =>{
    const data = ctx.update.callback_query.data.split("_")[1];
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
    const order = orderValue[0];
    if(!order){
        await ctx.answerCbQuery("Buyurtma ma'lumotlari bilan muammo yuzaga keldi",{show_alert: true});
        return
    }

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
    await ctx.editMessageReplyMarkup({inline_keyboard:[[{text:"Buyurtmachi profili",url:`https://t.me/${order.user.phone}`}]]});
    await ctx.telegram.sendMessage(order.userId, `<b>---🟡 Haydovchi Sizni kutmoqda ---</b>\n\n<b>Ismi:</b> ${driver[0].user.name}\n<b>Telefon:</b> ${driver[0].user.phone}\n<b>Mashina rusumi:</b> ${driver[0].carModel}\n<b>Mashina raqami:</b> ${driver[0].carNumber}`,{
        parse_mode:"HTML"
    })
}

const waiting = ctx => handlerProvider(ctx, handler);
export default waiting;