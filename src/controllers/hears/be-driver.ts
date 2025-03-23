import SCENENAMES from "../../constants/scene-names";
import { BotCtx } from "../../types/context";
import handlerProvider, { deleteMessage } from "../../utils/functions";


const handler = (ctx: BotCtx) =>{
    if(ctx.chat.type === "private"){
        ctx.scene.enter(SCENENAMES.selectDriverType)
    }else{
        deleteMessage(ctx);
    }
}

const beDriver = ctx => handlerProvider(ctx, handler);
export default beDriver;