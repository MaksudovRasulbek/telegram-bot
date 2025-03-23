import { DISTRICTS } from "../../constants";
import SCENENAMES from "../../constants/scene-names";
import ORDERS from "../../schemas/orders";
import USERS from "../../schemas/users";
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
        const findDistrict = DISTRICTS.find(d => d.id === findOrder.districtId);
        const user = await USERS.findOne({chatId: ctx.from.id});
        if(!findDistrict || !user){
            await ctx.answerCbQuery("Ma'lumotlar bilan muammo yuzaga keldi, keyinroq urinib ko'ring",{show_alert:true});
            return
        }
        
        ctx.session.orderIdForEditPrice = String(findOrder._id)
        ctx.scene.enter(SCENENAMES.editOrderPrice);
    }else{
        await ctx.answerCbQuery("Buyurtmani allaqachon qabul qilingan", {show_alert: true});
    }
}

const editOrderPrice = ctx => handlerProvider(ctx, handler);
export default editOrderPrice;