import { Scenes } from "telegraf";
import { KEYBOARDS } from "../../constants";
import { regioanPriceButtons } from "../../constants/prices";
import SCENENAMES from "../../constants/scene-names";
import { actions } from "../../controllers/actions";
import { startKeyboard } from "../../controllers/commands/start";
import { BotCtx } from "../../types/context";
import handlerProvider, { deleteMessage, replyWithBoldText, sceneLeave } from "../../utils/functions";
import { editOrderButtons, regionalOrderLocationButtons, requestContact, submitOrderButtons } from "./constants";
import { checkPhoneNumber, createRegionalOrder } from "./functions";

const checkOrderValues = async(ctx: BotCtx, next: Function) =>{
    if(!ctx.session?.callRegionalTaxi || !ctx.session?.editRegionalOrderKey){
        sceneLeave(ctx, true, false);
        const keyboard = await startKeyboard(ctx);
        replyWithBoldText(ctx, "Ma'lumotlar bilan muammo yuzaga keldi, Iltimos boshidan taksi buyurtma qiling :)", keyboard);
        return
    }
    if(ctx?.update?.callback_query?.data){
        const callbackData = ctx.update.callback_query.data;
        
        // Check if callbackData matches any regex in actions
        for (const action of actions) {
            if (action.regex.test(callbackData)) {
                await action.handler(ctx);
                return; // Stop further execution
            }
        }
        ctx.answerCbQuery("Jarayonni tugatmasdan turib, inline tugmalarni ishlata olmaysiz :(",{show_alert: true});
       return
   }
   const text = ctx?.message?.text || ctx?.message?.contact;
   if(!text){
        deleteMessage(ctx);
       return
   }
   next();
}

const enter = async(ctx: BotCtx) =>{
    const key = ctx.session.editRegionalOrderKey;
    const value = ctx.session.callRegionalTaxi;
    if(key === "from"){
        const buttons = await regionalOrderLocationButtons(ctx, value.fromRegion.id)
        replyWithBoldText(ctx, `${value.fromRegion.text}ni qayeridan ketasiz`,buttons, !buttons ? true : null)
    }
    if(key === "to"){
        const buttons = await regionalOrderLocationButtons(ctx, value.toRegion.id);
        replyWithBoldText(ctx, `${value.toRegion.text}ni qayeriga ketasiz`,buttons, !buttons ? true : null)
    }
    if(key === "price"){
        const keyboards = regioanPriceButtons()
        replyWithBoldText(ctx, "Siz taklif qilgan narx ? Narxni pastdagilarni tanlab qoyishingiz ham mumkin.", keyboards)
    }
    if(key === "phoneNumber"){
        replyWithBoldText(ctx, "Siz bilan bog'lanish uchun raqamingizni tasdiqlang.", requestContact)
    }
    return ctx.wizard.next();
}

const checkValue = async(ctx: BotCtx) =>{
    const key = ctx.session.editRegionalOrderKey;
    const text = ctx?.message?.text;
   
    if(key === "from"){
        ctx.session.callRegionalTaxi.from = text;
    }
    if(key === "to"){
        ctx.session.callRegionalTaxi.to = text;
    }
    if(key === "price"){
        const sumRegex = new RegExp(/^[1-9]\d*$/);
        if(!sumRegex.test(text)){
            replyWithBoldText(ctx, "Iltimos narxni to'gri kiriting, so'z qo'shmasdan, orasini ochmasdan shunchaki raqamlar orqali. \n\nNamuna : 10000");
            return
        }
        if(Number(text) < 1000){
            replyWithBoldText(ctx, "Narx juda ham kam, sal qimmatroq narx belgilang:");
            return
        }
        if(Number(text) >5000000){
            replyWithBoldText(ctx, "Narx juda ham baland, sal arzonroq narx belgilang:");
            return
        }
        ctx.session.callRegionalTaxi.price = Number(text);
    }
    if(key === "phoneNumber"){
        const txt = ctx?.message?.text || ctx?.message?.contact?.phone_number;
        const isAvailablePhoneNumber = checkPhoneNumber(ctx, txt);
        if(isAvailablePhoneNumber){
            ctx.session.callRegionalTaxi.phone = txt.padStart(13, "+");
        }else{
            return
        }
    }

    const value = ctx.session.callRegionalTaxi;
    replyWithBoldText(ctx, `Sizning ma'lumotlaringiz.\n\nQayerdan: ${value.fromRegion.text} (${value.from})\nQayerga: ${value.toRegion.text} (${value.to})\nNarxi: ${value.price}\nTelefon: ${value.phone}\n\nBuyurtmani tasdiqlash uchun (✅ Buyurtma berish) tugmasini bosish kerak`,submitOrderButtons);
    return ctx.wizard.next();
}

const verify = async(ctx: BotCtx) =>{
    const text = ctx.message.text;
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

const editRegionalOrderScene = new Scenes.WizardScene(SCENENAMES.editRegionalOrder,
(ctx: BotCtx) =>{checkOrderValues(ctx, () => handlerProvider(ctx, enter))},
(ctx: BotCtx) =>{checkOrderValues(ctx, () => handlerProvider(ctx, checkValue))},
(ctx: BotCtx) =>{checkOrderValues(ctx, () => handlerProvider(ctx, verify))},
);
export default editRegionalOrderScene