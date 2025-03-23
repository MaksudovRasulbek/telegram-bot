import { ENV, KEYBOARDS } from "../../constants";
import REGIONS from "../../constants/regions";
import { startKeyboard } from "../../controllers/commands/start";
import ORDERS from "../../schemas/orders";
import REGIONALORDERS from "../../schemas/regional-orders";
import USERS from "../../schemas/users";
import { BotCtx } from "../../types/context";
import { replyWithBoldText, replyWithInlineKeyboard, sceneLeave, sleep } from "../../utils/functions";
import { requestContact } from "./constants";


export const createOrder = async(ctx: BotCtx) =>{
    const value = ctx.session.callTaxi;
    const user = await USERS.findOne({chatId: ctx.from.id});
    if(!user){
        const newUser = new USERS({name: ctx.from.first_name, chatId: ctx.from.id, phone: value.phone, status:"user", city: value.district.id});
        await newUser.save();
    }
    if(user){
        user.phone = value.phone;
        user.city = value.district.id
        await user.save();
    }
    
    const newOrder = new ORDERS({
        districtId: value.district.id,
        status: "pending",
        userId: ctx.from.id,
        summa: value.price,
        from: value.from,
        to:value.to
    })

    const text = `---🔶 YANGI BUYURTMA---\n\nQayerdan: ${value.from}\nQayerga: ${value.to}\nNarxi: ${value.price}`
    const groupMessage = await ctx.telegram.sendMessage(value.district.chatId, text,{
        reply_markup:{
            inline_keyboard:[
                [{text:KEYBOARDS.accept, callback_data:`accept_order_${newOrder._id}`}]
            ]
        }
    });

    await ctx.telegram.sendMessage(ENV.channelId, `${text}\n\nFoydalanuvchi\n\nIsmi: ${user?.name ?? ctx.from.first_name}\nRaqami: ${value.phone}\nTelegram id: ${ctx.from.id}`,{
        reply_markup:{
            inline_keyboard:[
                [
                    {text: user?.status === "blocked" ? "Blokdan chiqarish" :"Bloklash", callback_data: user?.status === "blocked" ? `unblock_user_${ctx.from.id}` :`block_user_${ctx.from.id}` },
                    {text:"Foydalanuvchi profili",url:`t.me/${value.phone}`}
                ]
            ]
        }
    }).catch(() => {});
    
    newOrder.messageId = groupMessage.message_id;
    await newOrder.save();
    await replyWithInlineKeyboard(ctx, `Javobni kuting\n\nBuyurtma ko'rib chiqilmoqda... \n\n- Haydovchi siz bilan bog'lanadi\n\n${ctx.from.first_name}, Qishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`,[[{text:KEYBOARDS.cancel, callback_data:`cancel_order_${newOrder._id}`}]])
    await sceneLeave(ctx, true, false);
    const keyboard = await startKeyboard(ctx);
    await replyWithBoldText(ctx, "🚕", keyboard);
    await reSendOrder(ctx, String(newOrder._id))
}

export const reSendOrder = async(ctx: BotCtx, orderId: string) =>{
    const time = 1000*60;
    await sleep(5*time);
    const findOrder = await ORDERS.findById(orderId);
    if(findOrder && findOrder.status === "pending"){
        replyWithInlineKeyboard(ctx, `---♻️ NARXNI O'ZGARTIRISH ---\n\nQayerdan: ${findOrder.from}\nQayerga: ${findOrder.to}\nNarxi: ${findOrder.summa}\n\nYo'l haqqi haydovchilarga ma'qul kelmayapti iltimos uni o'zgartiring.`,
           [[{text:KEYBOARDS.editPrice, callback_data:`edit_order_${orderId}`},{text: KEYBOARDS.cancel, callback_data:`cancel_order_${orderId}`}]]
        )
    }
}

export const createRegionalOrder = async(ctx: BotCtx) =>{
    const value = ctx.session.callRegionalTaxi;
    const user = await USERS.findOne({chatId: ctx.from.id});
    if(!user){
        const newUser = new USERS({name: ctx.from.first_name, chatId: ctx.from.id, phone: value.phone, status:"user", city: value.fromRegion.id});
        await newUser.save();
    }
    if(user){
        user.phone = value.phone;
        user.city = value.fromRegion.id
        await user.save();
    }
    
    const newOrder = new REGIONALORDERS({
        fromRegionId: value.fromRegion.id,
        toRegionId: value.toRegion.id,
        status: "pending",
        userId: ctx.from.id,
        summa: value.price,
        from: value.from,
        to:value.to
    })

    const from  = REGIONS.find(r => r.id === newOrder.fromRegionId);
    const to = REGIONS.find(r => r.id === newOrder.toRegionId);

    if(from && to){
    const text = `---🔶 YANGI BUYURTMA---\n\nQayerdan: ${from.text} (${value.from})\nQayerga: ${to.text} (${value.to})\nNarxi: ${value.price}`
    const groupMessage = await ctx.telegram.sendMessage(from.chatId, text,{
        reply_markup:{
            inline_keyboard:[
                [{text:KEYBOARDS.accept, callback_data:`accept_regional_order_${newOrder._id}`}]
            ]
        }
    });

    await ctx.telegram.sendMessage(ENV.channelId, `${text}\n\nFoydalanuvchi\n\nIsmi: ${user?.name ?? ctx.from.first_name}\nRaqami: ${value.phone}\nTelegram id: ${ctx.from.id}`,{
        reply_markup:{
            inline_keyboard:[
                [
                    {text: user?.status === "blocked" ? "Blokdan chiqarish" :"Bloklash", callback_data: user?.status === "blocked" ? `unblock_user_${ctx.from.id}` :`block_user_${ctx.from.id}` },
                    {text:"Foydalanuvchi profili",url:`t.me/${value.phone}`}
                ]
            ]
        }
    }).catch(() => {});
    
    newOrder.messageId = groupMessage.message_id;
    await newOrder.save();
    await replyWithInlineKeyboard(ctx, `Javobni kuting\n\nBuyurtma ko'rib chiqilmoqda... \n\n- Haydovchi siz bilan bog'lanadi\n\n${ctx.from.first_name}, Qishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`,[[{text:KEYBOARDS.cancel, callback_data:`cancel_regional_order_${newOrder._id}`}]])
    await sceneLeave(ctx, true, false);
    const keyboard = await startKeyboard(ctx);
    await replyWithBoldText(ctx, "🚕", keyboard);
    await reSendRegionalOrder(ctx, String(newOrder._id))
    }
}

export const reSendRegionalOrder = async(ctx: BotCtx, orderId: string) =>{
    const time = 1000*60;
    await sleep(5*time);
    const findOrder = await REGIONALORDERS.findById(orderId);
    if(findOrder && findOrder.status === "pending"){
        const from  = REGIONS.find(r => r.id === findOrder.fromRegionId);
        const to = REGIONS.find(r => r.id === findOrder.toRegionId);
        if(to && from){
            replyWithInlineKeyboard(ctx, `---♻️ NARXNI O'ZGARTIRISH ---\n\nQayerdan: ${from.text} (${findOrder.from})\nQayerga: ${to.text} (${findOrder.to})\nNarxi: ${findOrder.summa}\n\nYo'l haqqi haydovchilarga ma'qul kelmayapti iltimos uni o'zgartiring.`,
               [[{text:KEYBOARDS.editPrice, callback_data:`edit_regional_order_${orderId}`},{text: KEYBOARDS.cancel, callback_data:`cancel_regional_order_${orderId}`}]]
            )
        }
    }
}

export const checkSum = (ctx: BotCtx, text:string): boolean =>{
    const sumRegex = new RegExp(/^[1-9]\d*$/);
    if(!sumRegex.test(text)){
        replyWithBoldText(ctx, "Iltimos narxni to'gri kiriting, so'z qo'shmasdan, orasini ochmasdan shunchaki raqamlar orqali. \n\nNamuna : 10000");
        return false
    }
    if(Number(text) < 1000){
        replyWithBoldText(ctx, "Narx juda ham kam, sal qimmatroq narx belgilang:");
        return false
    }
    if(Number(text) >5000000){
        replyWithBoldText(ctx, "Narx juda ham baland, sal arzonroq narx belgilang:");
        return false
    }
    return true
}

export const checkPhoneNumber = (ctx: BotCtx, text: string) : boolean =>{
    const phoneRegex = new RegExp(/^\+998\d{9}$/);
    
    if (!phoneRegex.test(text.padStart(13, "+"))) {
        replyWithBoldText(ctx, "Xato raqam, Iltimos raqamingizni to'gri (+998xxxxxxxxx formatda) kiriting yoki pastdagi tugma orqali yuboring.",requestContact)
        return false;
    }
    return true
}