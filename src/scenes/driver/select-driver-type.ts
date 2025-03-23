import { Scenes } from "telegraf";
import { KEYBOARDS } from "../../constants";
import SCENENAMES from "../../constants/scene-names";
import onlyTextMiddleware from "../../middlewares/only-text";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText } from "../../utils/functions";

const enter = (ctx: BotCtx) =>{
    replyWithBoldText(ctx, "Tanlang", [
        [{text:KEYBOARDS.inRegion}],
        [{text:KEYBOARDS.accrosRegion}],
    ])
    return ctx.wizard.next();
}


const checkCarNumber = (ctx: BotCtx) =>{
    const text = ctx.message.text;
    if(text === KEYBOARDS.inRegion){
        return ctx.scene.enter(SCENENAMES.beDriver);
    }
    if(text === KEYBOARDS.accrosRegion){
        return ctx.scene.enter(SCENENAMES.beRegionalDriver)
    }
}
 
const selectDriverTypeScene = new Scenes.WizardScene(
    SCENENAMES.selectDriverType,
    async (ctx: BotCtx) => { handlerProvider(ctx, enter) },
    async (ctx: BotCtx) => { await onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkCarNumber)); },
);

export default selectDriverTypeScene