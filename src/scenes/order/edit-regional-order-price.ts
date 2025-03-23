import { Scenes } from "telegraf";
import { KEYBOARDS } from "../../constants";
import { regioanPriceButtons } from "../../constants/prices";
import REGIONS from "../../constants/regions";
import SCENENAMES from "../../constants/scene-names";
import { actions } from "../../controllers/actions";
import { startKeyboard } from "../../controllers/commands/start";
import REGIONALORDERS from "../../schemas/regional-orders";
import { BotCtx } from "../../types/context";
import handlerProvider, { deleteMessage, regionalOrderInfo, replyWithBoldText, replyWithInlineKeyboard, sceneLeave } from "../../utils/functions";
import { checkSum, reSendRegionalOrder } from "./functions";

const checkOrderValues = async(ctx: BotCtx, next: Function) =>{
    if(!ctx.session?.regionalOrderIdForEditPrice){
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
   const text = ctx?.message?.text;
   if(!text){
        deleteMessage(ctx);
       return
   }
   next();
}

const enter = async(ctx: BotCtx) =>{
    const keyboards = regioanPriceButtons();
    replyWithBoldText(ctx, "Siz taklif qilgan narx ? Narxni pastdagilarni tanlab qoyishingiz ham mumkin.", keyboards)
    return ctx.wizard.next();
}

const checkValue = async(ctx: BotCtx) =>{
    const text = ctx?.message?.text;
   
   const isAvailableSum = checkSum(ctx, text);
   if(isAvailableSum){
       const order = await REGIONALORDERS.findById(ctx.session.regionalOrderIdForEditPrice);
       if(!order){
           replyWithBoldText(ctx, "Ma'lumotlar bilan muammo yuzaga keldi, keyinroq urinib ko'ring");
           sceneLeave(ctx, true, false);
           return
       }
       if(order.status != "pending"){
           replyWithBoldText(ctx, "Buyurtmangiz qabul qilingan, endi narxini o'zgartira olmaysiz");
           sceneLeave(ctx, true, false);
           return
       }
       const findGroup = REGIONS.find(d => d.id == order.fromRegionId);
       const to = REGIONS.find(r => r.id === order.toRegionId);
       if(!findGroup){
           replyWithBoldText(ctx, "Ma'lumotlar bilan muammo yuzaga keldi, keyinroq urinib ko'ring");
           sceneLeave(ctx, true, false);
           return
       }

       const infoText = regionalOrderInfo(order);

       await ctx.telegram.editMessageText(findGroup.chatId,order.messageId, "", 
       `<b>---🛑 BEKOR QILINDI ---</b>\n\n\n${infoText}`,
    {
       parse_mode:"HTML"
    });
       const groupMessage = await ctx.telegram.sendMessage(findGroup.chatId, `---🔶 YANGI BUYURTMA---\n\nQayerdan: ${findGroup.text} (${order.from})\nQayerga: ${to.text} (${order.to})\nNarxi: ${text}`,{
           reply_markup:{
               inline_keyboard:[
                   [{text:"Qabul qilish", callback_data:`accept_regional_order_${order._id}`}]
               ]
           }
       });
       await REGIONALORDERS.findByIdAndUpdate(ctx.session.regionalOrderIdForEditPrice,{messageId:groupMessage.message_id, summa: text});
       await replyWithInlineKeyboard(ctx, `Javobni kuting\n\nBuyurtma ko'rib chiqilmoqda... \n\n- Haydovchi siz bilan bog'lanadi\n\n${ctx.from.first_name}, Qishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`,[[{text:KEYBOARDS.cancel, callback_data:`cancel_regional_order_${order._id}`}]]);
       await sceneLeave(ctx, true, false);
       const keyboard = await startKeyboard(ctx);
       await replyWithBoldText(ctx, "🚕", keyboard);
       await reSendRegionalOrder(ctx, ctx.session.regionalOrderIdForEditPrice);
   }
}

const editRegionalOrderPriceScene = new Scenes.WizardScene(SCENENAMES.editRegionalOrderPrice,
(ctx: BotCtx) =>{handlerProvider(ctx, enter)},
(ctx: BotCtx) =>{checkOrderValues(ctx, () =>handlerProvider(ctx, checkValue))},
);

export default editRegionalOrderPriceScene