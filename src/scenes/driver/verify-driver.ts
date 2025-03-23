import { Scenes } from "telegraf";
import { KEYBOARDS } from "../../constants";
import SCENENAMES from "../../constants/scene-names";
import { startKeyboard } from "../../controllers/commands/start";
import onlyTextMiddleware from "../../middlewares/only-text";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText, sceneLeave } from "../../utils/functions";
import { editDriverButtons, submitDriverButtons } from "./constants";
import { createDriver } from "./functions";

const enter = async(ctx: BotCtx) =>{
    const value = ctx.session?.beDriverValue;
    if(!value){
        const keyboard = await startKeyboard(ctx);
       replyWithBoldText(ctx, "Ma'lumotlar bilan muammo yuzaga keldi keyinroq urinib ko'ring", keyboard);
       sceneLeave(ctx, true, false);
       return
    }

        replyWithBoldText(ctx, `Ilovani tasdiqlang. \n\nIsmi:  ${value.name}\nTelefon:  ${value.phone}\nAvtomobil modeli:  ${value.carModel}\nAvtomobil raqami:  ${value.carNumber}\n${ctx.session?.beDriverValue?.type === "regional" ? "Viloyat" :"Tuman"}:  ${value.district.text}\n\nIlovani tasdiqlash uchun "${KEYBOARDS.confirm}" tugmasini bosish kerak`, submitDriverButtons);
        return ctx.wizard.next();
}

const verify = async(ctx: BotCtx)=>{
    const text = ctx.message.text;
    if(text === KEYBOARDS.confirm){
        await createDriver(ctx);
        return 
    }
    if(text === KEYBOARDS.editOrder){
        replyWithBoldText(ctx, "Nimani o'zgartirishni hohlaysiz?", editDriverButtons.map(b => [{text:b.text}]));
        return
    }
    //qaysi qiymatni o'zgartirishni hohlashini bilish uchun
    editDriverButtons.forEach((b) =>{
        if(b.text === text){
            ctx.session.editDriverKey = b.key
            ctx.scene.enter(SCENENAMES.editDriver);
            return
        }
    });
}

const verifyDriverScene = new Scenes.WizardScene(
    SCENENAMES.verifyDriver,
    (ctx: BotCtx) =>{handlerProvider(ctx, enter)},
    async(ctx: BotCtx) =>{await onlyTextMiddleware(ctx, () => handlerProvider(ctx, verify))},
);
export default verifyDriverScene