import { Scenes } from "telegraf";
import { BotCtx } from "../../types/context";
import handlerProvider, {  deleteMessage, replyWithBoldText } from "../../utils/functions";
import DISTRICTS, { districtButtons } from "../../constants/districts";
import { priceButtons } from "../../constants/prices";
import { KEYBOARDS } from "../../constants";
import { editOrderButtons, orderLocationButtons, requestContact, submitOrderButtons } from "./constants";
import { checkPhoneNumber, checkSum, createOrder } from "./functions";
import SCENENAMES from "../../constants/scene-names";
import onlyTextMiddleware from "../../middlewares/only-text";
import onlyPhoneNumberMiddleware from "../../middlewares/only-phone-number";

const enter = (ctx: BotCtx) =>{
    const keyboards = districtButtons();
    replyWithBoldText(ctx, "Tumanni tanlang", keyboards)
    return ctx.wizard.next();
}

const checkDistrict = async(ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    const findDistrict = DISTRICTS.find(d => d.text === text);
    if(!findDistrict){
        deleteMessage(ctx);
        return
    }
    ctx.session.callTaxi = {district: findDistrict};
    const buttons = await orderLocationButtons(ctx, findDistrict.id);            
    replyWithBoldText(ctx, "Qayerdan ketasiz",buttons, !buttons ? true : null)
    return ctx.wizard.next();
}

const checkFrom = async(ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    ctx.session.callTaxi.from = text;
    const buttons = await orderLocationButtons(ctx, ctx.session.callTaxi.district.id);
    replyWithBoldText(ctx, "Qayerga ketasiz",buttons, !buttons ? true : null)
    return ctx.wizard.next();
}

const checkTo = (ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    ctx.session.callTaxi.to = text;
    const keyboards = priceButtons()
    replyWithBoldText(ctx, "Siz taklif qilgan narx ? Narxni pastdagilarni tanlab qoyishingiz ham mumkin.", keyboards)
    return ctx.wizard.next();
}

const checkPrice = (ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    const isAvailableSum = checkSum(ctx, text);
    if(isAvailableSum){
        ctx.session.callTaxi.price = Number(text);
        replyWithBoldText(ctx, "Siz bilan bog'lanish uchun raqamingizni tasdiqlang.", requestContact)
        return ctx.wizard.next();
    }
}

const checkPhone = (ctx: BotCtx) =>{
    const text = ctx?.message?.text || ctx?.message?.contact?.phone_number;
   const isAvailablePhoneNumber = checkPhoneNumber(ctx, text);
   if(isAvailablePhoneNumber){
       ctx.session.callTaxi.phone = text.padStart(13, "+");
       const value = ctx.session.callTaxi;
       replyWithBoldText(ctx, `Sizning ma'lumotlaringiz.\n\nQayerdan: ${value.from}\nQayerga: ${value.to}\nNarxi: ${value.price}\nTelefon: ${value.phone}\n\nBuyurtmani tasdiqlash uchun (✅ Buyurtma berish) tugmasini bosish kerak`,submitOrderButtons);
       return ctx.wizard.next();
   }
}

const verify = async(ctx: BotCtx) =>{   
    const text = ctx?.message?.text;
    //buyurtma berish tugmasi bosilganda
    if(text=== KEYBOARDS.addOrder){
       await createOrder(ctx);
        return
    }
    //O'zgartirish tugmasi bosilganda
    if(text === KEYBOARDS.editOrder){
        replyWithBoldText(ctx, "Nimani o'zgartirishni hohlaysiz?",editOrderButtons.map(b => [{text:b.text}]));
        return
    }
    //qaysi qiymatni o'zgartirishni hohlashini bilish uchun
    editOrderButtons.forEach((b) =>{
        if(b.text === text){
            ctx.session.editOrder = {key: b.key}
            ctx.scene.enter(SCENENAMES.editOrder);
            return
        }
    });
}

const addOrderScene = new Scenes.WizardScene(SCENENAMES.addOrder, 
    (ctx: BotCtx) =>{handlerProvider(ctx, enter)},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkDistrict))},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkFrom))},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkTo))},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkPrice))},
    (ctx: BotCtx) =>{onlyPhoneNumberMiddleware(ctx, () => handlerProvider(ctx, checkPhone))},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, verify))}
)

export default addOrderScene