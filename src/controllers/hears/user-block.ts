import { ENV, KEYBOARDS } from "../../constants";
import SCENENAMES from "../../constants/scene-names";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText } from "../../utils/functions";


const handler = (ctx: BotCtx) =>{
    if(ctx.from.id != ENV.adminId){
        replyWithBoldText(ctx, "Siz admin emassiz");
        return
    }
    const text = ctx.message.text;
    const blockType = text === KEYBOARDS.block ? "block" : text === KEYBOARDS.unblock ? "unblock" : undefined
    ctx.session.userBlock = blockType;
    ctx.scene.enter(SCENENAMES.block);
}

const userBlock = ctx => handlerProvider(ctx, handler);
export default userBlock