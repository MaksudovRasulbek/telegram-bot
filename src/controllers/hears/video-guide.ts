import { KEYBOARDS } from "../../constants";
import { BotCtx } from "../../types/context";
import handlerProvider from "../../utils/functions";

const handler = async(ctx: BotCtx) =>{
    await ctx.telegram.sendAnimation(ctx.from.id, "https://t.me/bottekshiruv/9526",{
        caption:KEYBOARDS.callTaxi
    });
    await ctx.telegram.sendAnimation(ctx.from.id, "https://t.me/bottekshiruv/9527",{
        caption:KEYBOARDS.toBeTaxi
    });
}

const videoGuide = ctx => handlerProvider(ctx, handler);
export default videoGuide