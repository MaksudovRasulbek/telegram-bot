import { Scenes } from "telegraf";
import { BotCtx } from "../../types/context";
import handlerProvider, {  deleteMessage, replyWithBoldText,  replyWithInlineKeyboard,  sceneLeave } from "../../utils/functions";
import { startKeyboard } from "../../controllers/commands/start";
import { priceButtons } from "../../constants/prices";
import { DISTRICTS, KEYBOARDS } from "../../constants";
import ORDERS from "../../schemas/orders";
import { checkSum, reSendOrder } from "./functions";
import SCENENAMES from "../../constants/scene-names";
import { actions } from "../../controllers/actions";

const checkOrderValues = async(ctx: BotCtx, next: Function) =>{
    if(!ctx.session?.orderIdForEditPrice){
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
    const keyboards = priceButtons();
    replyWithBoldText(ctx, "Siz taklif qilgan narx ? Narxni pastdagilarni tanlab qoyishingiz ham mumkin.", keyboards)
    return ctx.wizard.next();
}

const checkValue = async(ctx: BotCtx) =>{
    const text = ctx?.message?.text;
   
   const isAvailableSum = checkSum(ctx, text);
   if(isAvailableSum){
       const order = await ORDERS.findById(ctx.session.orderIdForEditPrice);
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
       const findGroup = DISTRICTS.find(d => d.id == order.districtId);
       if(!findGroup){
           replyWithBoldText(ctx, "Ma'lumotlar bilan muammo yuzaga keldi, keyinroq urinib ko'ring");
           sceneLeave(ctx, true, false);
           return
       }

       await ctx.telegram.editMessageText(findGroup.chatId,order.messageId, "", 
       `<b>---🛑 BEKOR QILINDI ---</b>\n\n<b>Qayerdan</b>: ${order.from}\n<b>Qayerga</b>: ${order.to}\n<b>Narxi</b>: ${order.summa}`,
    {
       parse_mode:"HTML"
    });
       const groupMessage = await ctx.telegram.sendMessage(findGroup.chatId, `---🔶 YANGI BUYURTMA---\n\nQayerdan: ${order.from}\nQayerga: ${order.to}\nNarxi: ${text}`,{
           reply_markup:{
               inline_keyboard:[
                   [{text:"Qabul qilish", callback_data:`accept_order_${order._id}`}]
               ]
           }
       });
       await ORDERS.findByIdAndUpdate(ctx.session.orderIdForEditPrice,{messageId:groupMessage.message_id, summa: text});
       await replyWithInlineKeyboard(ctx, `Javobni kuting\n\nBuyurtma ko'rib chiqilmoqda... \n\n- Haydovchi siz bilan bog'lanadi\n\n${ctx.from.first_name}, Qishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`,[[{text:KEYBOARDS.cancel, callback_data:`cancel_order_${order._id}`}]]);
       await sceneLeave(ctx, true, false);
       const keyboard = await startKeyboard(ctx);
       await replyWithBoldText(ctx, "🚕", keyboard);
       await reSendOrder(ctx, ctx.session.orderIdForEditPrice);
   }
}

const editOrderPriceScene = new Scenes.WizardScene(SCENENAMES.editOrderPrice,
(ctx: BotCtx) =>{handlerProvider(ctx, enter)},
(ctx: BotCtx) =>{checkOrderValues(ctx, () =>handlerProvider(ctx, checkValue))},
);

export default editOrderPriceScene