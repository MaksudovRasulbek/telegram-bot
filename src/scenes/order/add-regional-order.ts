import { Scenes } from "telegraf";
import { KEYBOARDS } from "../../constants";
import { regioanPriceButtons } from "../../constants/prices";
import REGIONS, { regionButtons } from "../../constants/regions";
import SCENENAMES from "../../constants/scene-names";
import onlyPhoneNumberMiddleware from "../../middlewares/only-phone-number";
import onlyTextMiddleware from "../../middlewares/only-text";
import { BotCtx } from "../../types/context";
import handlerProvider, { deleteMessage, replyWithBoldText } from "../../utils/functions";
import { editOrderButtons, regionalOrderLocationButtons, requestContact, submitOrderButtons } from "./constants";
import { checkPhoneNumber, checkSum, createRegionalOrder } from "./functions";

const enter = (ctx: BotCtx) =>{
    const keyboards = regionButtons();
    replyWithBoldText(ctx, "Qayerdan ketasiz", keyboards)
    return ctx.wizard.next();
}

const checkRegion = async(ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    const find = REGIONS.find(d => d.text === text);
    if(!find){
        deleteMessage(ctx);
        return
    }
    ctx.session.callRegionalTaxi = {fromRegion: find};
    const buttons = regionButtons(find.id);            
    replyWithBoldText(ctx, "Qayerga ketasiz",buttons, !buttons ? true : null)
    return ctx.wizard.next();
}

const checkRegionTo = async(ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    if(text === ctx.session.callRegionalTaxi.fromRegion.text){
        deleteMessage(ctx);
        return
    }
    const find = REGIONS.find(d => d.text === text);
    if(!find){
        deleteMessage(ctx);
        return
    }
    ctx.session.callRegionalTaxi.toRegion = find;
    const buttons = await regionalOrderLocationButtons(ctx, ctx.session.callRegionalTaxi.fromRegion.id);            
    replyWithBoldText(ctx, `${ctx.session.callRegionalTaxi.fromRegion.text}ni qayeridan ketasiz`,buttons, !buttons ? true : null)
    return ctx.wizard.next();
}

const checkFrom = async(ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    ctx.session.callRegionalTaxi.from = text;
    const buttons = await regionalOrderLocationButtons(ctx, ctx.session.callRegionalTaxi.toRegion.id);            
    replyWithBoldText(ctx, `${ctx.session.callRegionalTaxi.toRegion.text}ni qayeriga ketasiz`,buttons, !buttons ? true : null)
    return ctx.wizard.next();
}

const checkTo = (ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    ctx.session.callRegionalTaxi.to = text;
    const keyboards = regioanPriceButtons()
    replyWithBoldText(ctx, "Siz taklif qilgan narx ? Narxni pastdagilarni tanlab qoyishingiz ham mumkin.", keyboards)
    return ctx.wizard.next();
}

const checkPrice = (ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    const isAvailableSum = checkSum(ctx, text);
    if(isAvailableSum){
        ctx.session.callRegionalTaxi.price = Number(text);
        replyWithBoldText(ctx, "Siz bilan bog'lanish uchun raqamingizni tasdiqlang.", requestContact)
        return ctx.wizard.next();
    }
}

const checkPhone = (ctx: BotCtx) =>{
    const text = ctx?.message?.text || ctx?.message?.contact?.phone_number;
   const isAvailablePhoneNumber = checkPhoneNumber(ctx, text);
   if(isAvailablePhoneNumber){
       ctx.session.callRegionalTaxi.phone = text.padStart(13, "+");
       const value = ctx.session.callRegionalTaxi;       
       replyWithBoldText(ctx, `Sizning ma'lumotlaringiz.\n\nQayerdan:${value.fromRegion.text} (${value.from})\nQayerga: ${value.toRegion.text} (${value.to})\nNarxi: ${value.price}\nTelefon: ${value.phone}\n\nBuyurtmani tasdiqlash uchun (✅ Buyurtma berish) tugmasini bosish kerak`,submitOrderButtons);
       return ctx.wizard.next();
   }
}

const verify = async(ctx: BotCtx) =>{   
    const text = ctx?.message?.text;
    //buyurtma berish tugmasi bosilganda
    if(text=== KEYBOARDS.addOrder){
       await createRegionalOrder(ctx);
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
            ctx.session.editRegionalOrderKey = b.key
            ctx.scene.enter(SCENENAMES.editRegionalOrder);
            return
        }
    });
}

const addRegionalOrderScene = new Scenes.WizardScene(SCENENAMES.addRegionalOrder, 
    (ctx: BotCtx) =>{handlerProvider(ctx, enter)},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkRegion))},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkRegionTo))},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkFrom))},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkTo))},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkPrice))},
    (ctx: BotCtx) =>{onlyPhoneNumberMiddleware(ctx, () => handlerProvider(ctx, checkPhone))},
    (ctx: BotCtx) =>{onlyTextMiddleware(ctx, () => handlerProvider(ctx, verify))}
)

export default addRegionalOrderScene