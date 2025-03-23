import { ENV } from "../../constants";
import DRIVERS from "../../schemas/drivers";
import USERS from "../../schemas/users";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText } from "../../utils/functions";


const handler = async(ctx: BotCtx) =>{
    const user = await USERS.findOne({chatId: ctx.from.id});
    const isAvailable =  (ctx.from.id === ENV.adminId || user && user.status === "admin");
    if(!isAvailable){
        replyWithBoldText(ctx, "Sizga ushbu statistikani ko'rish uchun ruhsat yo'q");
        return
    }
    const users = await USERS.estimatedDocumentCount();
    const drivers = await DRIVERS.estimatedDocumentCount();
    replyWithBoldText(ctx, `Jami obunachilar: ${users}\n\nHaydovchilar: ${drivers}\nYo'lovchilar: ${users - drivers}`);
}

const usersCount = ctx => handlerProvider(ctx, handler);
export default usersCount