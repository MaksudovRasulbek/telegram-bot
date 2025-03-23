import SCENENAMES from "../../constants/scene-names";
import REGIONALORDERS from "../../schemas/regional-orders";
import USERS from "../../schemas/users";
import { BotCtx } from "../../types/context";
import handlerProvider from "../../utils/functions";


const handler = async(ctx: BotCtx) =>{    
    const data = ctx.update.callback_query.data.split("_")[3];
    const findOrder = await REGIONALORDERS.findOne({_id: data});
    if(!findOrder){
        await ctx.answerCbQuery("Buyurtma bazadan topilmadi :(",{show_alert: true});
        return
    }
    if(findOrder.status === "pending"){
        const user = await USERS.findOne({chatId: ctx.from.id});
        if(!user){
            await ctx.answerCbQuery("Ma'lumotlar bilan muammo yuzaga keldi, keyinroq urinib ko'ring",{show_alert:true});
            return
        }
        
        ctx.session.regionalOrderIdForEditPrice = String(findOrder._id)
        ctx.scene.enter(SCENENAMES.editRegionalOrderPrice);
    }else{
        await ctx.answerCbQuery("Buyurtmani allaqachon qabul qilingan", {show_alert: true});
    }
}

const editRegionalOrderPrice = ctx => handlerProvider(ctx, handler);
export default editRegionalOrderPrice;