import { Scenes } from "telegraf";
import USERS from "../../schemas/users";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText, sceneLeave } from "../../utils/functions";
import SCENENAMES from "../../constants/scene-names";
import onlyTextMiddleware from "../../middlewares/only-text";
import { ENV } from "../../constants";


const enter = (ctx: BotCtx) =>{
    replyWithBoldText(ctx, "Foydalanuvchi telegram idsini kiriting");
    return ctx.wizard.next();
}

const checkId = async(ctx: BotCtx) =>{
    const isTypeBlock = ctx.session.userBlock === "block";
    const text = ctx.message.text.trim();
    if(parseInt(text) === ENV.adminId){
        replyWithBoldText(ctx, "Boshqa id raqam kiriting");
        return
    }
    const user = await USERS.findOne({chatId: text});
    if(!user){
        replyWithBoldText(ctx, "Foydalanuvchi mavjud emas");
        return
    }
    user.status = isTypeBlock ? "blocked" : "admin";
    await user.save();
    await replyWithBoldText(ctx, `Foydalanuvchi muvaffaqiyatli ${isTypeBlock ? "bloklandi" :"blokdan chiqarildi"} \n\nIsmi: ${user.name}\nRaqami: ${user.phone}`)
    await sceneLeave(ctx, true, true);
}

const userBlockScene = new Scenes.WizardScene(SCENENAMES.block,
    (ctx: BotCtx) => handlerProvider(ctx, enter),
    (ctx: BotCtx) => onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkId))
);

export default userBlockScene