import { Scenes } from "telegraf";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText } from "../../utils/functions";
import SCENENAMES from "../../constants/scene-names";
import { requestContact } from "../order/constants";
import { checkPhoneNumber } from "../order/functions";
import { checkAvailableCarModel, checkSessionValueMiddleware } from "./functions";
import onlyPhoneNumberMiddleware from "../../middlewares/only-phone-number";


const enter = (ctx: BotCtx) =>{
    const key = ctx.session.editDriverKey;
    if(key === "name"){
        replyWithBoldText(ctx, "Ism familiyangizni kiriting.",null, true);
    }
    if(key === "phoneNumber"){
        replyWithBoldText(ctx, "Siz bilan bog'lanish uchun raqamingizni tasdiqlang.", requestContact)
    }
    if(key === "carModel"){
        replyWithBoldText(ctx, "Mashina rusumini kiriting (Masalan: Jentra qora).", null, true);
    }
    if(key === "carNumber"){
        replyWithBoldText(ctx, "Mashina raqamini kiriting (Masalan: 156 AFT).", null, true)
    }
    return ctx.wizard.next();
}

const check = async(ctx: BotCtx)=>{
    const key = ctx.session.editDriverKey;
    const text = ctx.message?.text || ctx.message?.contact?.phone_number;
    if(key === "name"){
        ctx.session.beDriverValue.name = ctx.message.text;
    }
    if(key === "phoneNumber"){
        const isAvailablePhoneNumber = checkPhoneNumber(ctx, text);
        if(isAvailablePhoneNumber){
            ctx.session.beDriverValue.phone = text.padStart(13, "+");
        }else{
            return
        }
    }
    if(key === "carModel"){
        const isAvailableCarModel = checkAvailableCarModel(ctx, text);
        if(isAvailableCarModel){
            ctx.session.beDriverValue.carModel = text;
        }else{
            return
        }
    }
    if(key === "carNumber"){
        ctx.session.beDriverValue.carNumber = text
    }
    return ctx.scene.enter(SCENENAMES.verifyDriver);
}


const editDriverScene = new Scenes.WizardScene(SCENENAMES.editDriver,
    async (ctx: BotCtx) =>{await checkSessionValueMiddleware(ctx,() => handlerProvider(ctx, enter))},
    async (ctx: BotCtx) =>{await onlyPhoneNumberMiddleware(ctx,() => handlerProvider(ctx, check))},
);

export default editDriverScene