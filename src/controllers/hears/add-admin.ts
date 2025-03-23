import SCENENAMES from "../../constants/scene-names";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText } from "../../utils/functions";


const handler = (ctx: BotCtx) =>{
    ctx.scene.enter(SCENENAMES.addAdmin);
}

const addAdmin = ctx => handlerProvider(ctx, handler);
export default addAdmin