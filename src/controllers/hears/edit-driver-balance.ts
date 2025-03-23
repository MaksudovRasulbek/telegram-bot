import SCENENAMES from "../../constants/scene-names";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText } from "../../utils/functions";


const handler = (ctx: BotCtx) =>{
    ctx.scene.enter(SCENENAMES.editDriverBalance);
}

const editDriverBalance = ctx => handlerProvider(ctx, handler);
export default editDriverBalance