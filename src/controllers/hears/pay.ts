import { ENV } from "../../constants";
import DRIVERS from "../../schemas/drivers";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText, replyWithInlineKeyboard } from "../../utils/functions";
import { startKeyboard } from "../commands/start";


const handler = async(ctx: BotCtx) =>{
    const driver = await DRIVERS.findOne({chatId: ctx.from.id});
    if(!driver){
        const keyboard = await startKeyboard(ctx);
        replyWithBoldText(ctx, "Siz haydovchi profiliga ega emassiz", keyboard);
        return
    }
    replyWithInlineKeyboard(ctx, `Sizning ID raqamingiz ${ctx.from.id}\n\nBalansingizda ${driver.balance} so'm\n\nBalansni to'ldirish uchun quyidagi raqamga o'tkazing: \n- Click raqam: <code>+998 91 406 63 39</code> (Abdurahmon S.)\n\nQuyidagi Chekni yuborish tugmasiga o'ting va transfer chekini va ushbu ID ${ctx.from.id} ni menejerga yuboring`,[
        [{text:"📄 Chekni yuborish", url: ENV.adminUrl}]
    ])
}

const pay = ctx => handlerProvider(ctx, handler);
export default pay