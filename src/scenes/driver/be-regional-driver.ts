import { Scenes } from "telegraf";
import REGIONS, { regionButtons } from "../../constants/regions";
import SCENENAMES from "../../constants/scene-names";
import onlyPhoneNumberMiddleware from "../../middlewares/only-phone-number";
import onlyTextMiddleware from "../../middlewares/only-text";
import DRIVERS from "../../schemas/drivers";
import { BotCtx } from "../../types/context";
import handlerProvider, { deleteMessage, replyWithBoldText } from "../../utils/functions";
import { requestContact } from "../order/constants";
import { checkPhoneNumber } from "../order/functions";
import { checkAvailableCarModel } from "./functions";

const enter = (ctx: BotCtx) =>{
    const keyboards = regionButtons();
    replyWithBoldText(ctx, "Viloyatni tanlang",keyboards);
    return ctx.wizard.next();
}

const checkRegion = async(ctx: BotCtx) =>{
    const text = ctx?.message?.text;
    const find = REGIONS.find(d => d.text === text);
    if(!find){
        deleteMessage(ctx);
        return
    }
    ctx.session.beDriverValue = {district: find};
    const driver = await DRIVERS.aggregate([
        {$match:{
            chatId: ctx.from.id
        }},
        {
            $lookup:{
                from: "qq_taxi_users",
                localField: "chatId",
                foreignField: "chatId",
                as: "users"
            }
        },
        {
            $addFields: {
              user: { $arrayElemAt: ["$users", 0] }
            }
          },
          {
            $project: {
              users: 0 // Exclude the liked_movies array field
            }
          }
    ]);
    
    if(driver.length && driver[0]?.user){
        ctx.session.beDriverValue.carModel = driver[0].carModel
        ctx.session.beDriverValue.carNumber = driver[0].carNumber
        ctx.session.beDriverValue.district = find;
        ctx.session.beDriverValue.name = driver[0].user.name
        ctx.session.beDriverValue.phone = driver[0].user.phone
        ctx.session.beDriverValue.type = "regional";
        ctx.scene.enter(SCENENAMES.verifyDriver);
        return
    }
    replyWithBoldText(ctx, "Ism familiyangizni kiriting.",null, true);
    return ctx.wizard.next();
}

const checkName = (ctx: BotCtx) =>{
    ctx.session.beDriverValue.name = ctx.message.text;
    replyWithBoldText(ctx, "Siz bilan bog'lanish uchun raqamingizni tasdiqlang.", requestContact);
    return ctx.wizard.next();
}

const checkPhone = (ctx: BotCtx) =>{
    const text = ctx?.message?.text || ctx?.message?.contact?.phone_number;
    const isAvailablePhoneNumber = checkPhoneNumber(ctx, text);
    if(isAvailablePhoneNumber){
        ctx.session.beDriverValue.phone = text.padStart(13, "+");
        replyWithBoldText(ctx, "Mashina rusumini kiriting (Masalan: Jentra qora).",null, true);
        return ctx.wizard.next();
    }
}

const checkCarModel = (ctx: BotCtx) =>{
    const text =  ctx.message.text;
    const isAvailableCarModel = checkAvailableCarModel(ctx, text);
    if(isAvailableCarModel){
        ctx.session.beDriverValue.carModel = text;
        replyWithBoldText(ctx, "Mashina raqamini kiriting (Masalan: 156 AFT).", null, true);
        return ctx.wizard.next();
    }else{
        return
    }
}

const checkCarNumber = (ctx: BotCtx) =>{
    ctx.session.beDriverValue.carNumber = ctx.message.text;
    ctx.session.beDriverValue.type = "regional";
    return ctx.scene.enter(SCENENAMES.verifyDriver);
}
 
const beRegionalDriverScene = new Scenes.WizardScene(
    SCENENAMES.beRegionalDriver,
    async (ctx: BotCtx) => { handlerProvider(ctx, enter) },
    async (ctx: BotCtx) => { await onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkRegion)); },
    async (ctx: BotCtx) => { await onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkName)); },
    async (ctx: BotCtx) => { await onlyPhoneNumberMiddleware(ctx, () => handlerProvider(ctx, checkPhone)); },
    async (ctx: BotCtx) => { await onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkCarModel)); },
    async (ctx: BotCtx) => { await onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkCarNumber)); },
);

export default beRegionalDriverScene