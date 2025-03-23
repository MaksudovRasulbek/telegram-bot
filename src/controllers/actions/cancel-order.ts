import { DISTRICTS } from "../../constants";
import ORDERS from "../../schemas/orders";
import { BotCtx } from "../../types/context";
import handlerProvider from "../../utils/functions";


const handler = async(ctx: BotCtx) =>{    
    const data = ctx.update.callback_query.data.split("_")[2];
    const findOrder = await ORDERS.findOne({_id: data});
    if(!findOrder){
        await ctx.answerCbQuery("Buyurtma bazadan topilmadi :(",{show_alert: true});
        return
    }
    if(findOrder.status === "pending"){
        await ORDERS.findOneAndDelete({_id:findOrder._id})
        await ctx.telegram.editMessageText(ctx.from.id, ctx.update.callback_query.message.message_id, "", `---🟢 BUYURTMA BEKOR QILINDI---\n\n${ctx.from.first_name} : buyurtmangiz bekor qilindi.\n\nQishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`);

        const findDistrict = DISTRICTS.find(d => d.id == findOrder.districtId);
        if(findDistrict){
            await ctx.telegram.editMessageText(findDistrict.chatId, findOrder.messageId, "", `---🛑 BEKOR QILINDI ---\n\nQayerdan: ${findOrder.from}\nQayerga: ${findOrder.to}\nNarxi: ${findOrder.summa}`)
        }
    }else{
        await ctx.answerCbQuery("Buyurtmani bekor qilib bo'lmaydi :(", {show_alert: true});
    }
}

const cancelOrder = ctx => handlerProvider(ctx, handler);
export default cancelOrder;