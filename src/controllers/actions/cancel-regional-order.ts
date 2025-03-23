import REGIONS from "../../constants/regions";
import REGIONALORDERS from "../../schemas/regional-orders";
import { BotCtx } from "../../types/context";
import handlerProvider, { regionalOrderInfo } from "../../utils/functions";


const handler = async(ctx: BotCtx) =>{    
    const data = ctx.update.callback_query.data.split("_")[3];
    const findOrder = await REGIONALORDERS.findOne({_id: data});
    if(!findOrder){
        await ctx.answerCbQuery("Buyurtma bazadan topilmadi :(",{show_alert: true});
        return
    }
    if(findOrder.status === "pending"){
        await REGIONALORDERS.findOneAndDelete({_id:findOrder._id})
        await ctx.telegram.editMessageText(ctx.from.id, ctx.update.callback_query.message.message_id, "", `---🟢 BUYURTMA BEKOR QILINDI---\n\n${ctx.from.first_name} : buyurtmangiz bekor qilindi.\n\nQishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`);

        const findDistrict = REGIONS.find(d => d.id == findOrder.fromRegionId);
        if(findDistrict){
            const infoText = regionalOrderInfo(findOrder);
            await ctx.telegram.editMessageText(findDistrict.chatId, findOrder.messageId, "", `---🛑 BEKOR QILINDI ---\n\n${infoText}`)
        }
    }else{
        await ctx.answerCbQuery("Buyurtmani bekor qilib bo'lmaydi :(", {show_alert: true});
    }
}

const cancelRegionalOrder = ctx => handlerProvider(ctx, handler);
export default cancelRegionalOrder;