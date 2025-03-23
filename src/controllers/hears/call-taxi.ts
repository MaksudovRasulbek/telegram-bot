import { KEYBOARDS } from "../../constants";
import { BotCtx } from "../../types/context";
import handlerProvider, {  replyWithBoldText } from "../../utils/functions";

const handler = (ctx: BotCtx) =>{
    replyWithBoldText(ctx, "Tanlang", [
        [{text:KEYBOARDS.inRegion}],
        [{text:KEYBOARDS.accrosRegion}],
    ])
}

const callTaxi = ctx => handlerProvider(ctx, handler);
export default callTaxi