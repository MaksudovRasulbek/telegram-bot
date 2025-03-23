import { KEYBOARDS } from "../../constants";
import ORDERS from "../../schemas/orders";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText, replyWithInlineKeyboard, sleep } from "../../utils/functions";


const handler = async(ctx: BotCtx) =>{
    const orders= await ORDERS.find({status:"pending", userId: ctx.from.id});
    if(!orders.length){
        replyWithBoldText(ctx, "Hozirda kutilayotgan buyurtmalaringiz yo'q.");
        return
    }
    for(let i of orders){
        replyWithInlineKeyboard(ctx, `Qayerdan: ${i.from}\nQayerga: ${i.to}\nNarxi: ${i.summa}\n\nYo'l haqqi haydovchilarga ma'qul kelmayapti iltimos uni o'zgartiring.`,[
            [{text:KEYBOARDS.editPrice, callback_data:`edit_order_${i._id}`},{text: KEYBOARDS.cancel, callback_data:`cancel_order_${i._id}`}]
        ]);
        await sleep(500);
    }
}

const getOrders = ctx => handlerProvider(ctx, handler);
export default getOrders;