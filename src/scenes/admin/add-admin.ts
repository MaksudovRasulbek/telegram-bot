import { Scenes } from "telegraf";
import USERS from "../../schemas/users";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText, sceneLeave } from "../../utils/functions";
import { checkPhoneNumber } from "../order/functions";
import SCENENAMES from "../../constants/scene-names";
import onlyTextMiddleware from "../../middlewares/only-text";


const enter = (ctx: BotCtx) =>{
    replyWithBoldText(ctx, "Userni telefon nomerini kiriting.");
    return ctx.wizard.next();
}

const checkPhone = async(ctx: BotCtx) =>{
    const text = ctx.message.text;
    const isAvailablePhoneNumber = checkPhoneNumber(ctx, text);
    if(isAvailablePhoneNumber){
        const user = await USERS.findOne({phone: text});
        if(!user){
            replyWithBoldText(ctx, `Foydalanuvchi topilmadi, botga kirgan foydalanuvchini kamida bir marotaba taksi buyurtma bermasa yoki haydovchi profil yaratmasa admin qilolmaysiz`);
            return
        }
        if(user && user.status === "admin"){
            replyWithBoldText(ctx, `${user.name} allaqachon admin qilingan`);
            return
        }
        await USERS.findOneAndUpdate({phone: text}, {status:"admin"});
        await replyWithBoldText(ctx, `${user.name} (${text}) admin qilindi`);
        await ctx.telegram.sendMessage(user.chatId, "Siz moderator tomonidan admin qilindingiz\n\n/start bosing");
        await sceneLeave(ctx, true, false);
    }else{
        return
    }
}

const addAdminScene = new Scenes.WizardScene(SCENENAMES.addAdmin,
    (ctx: BotCtx) => handlerProvider(ctx, enter),
    (ctx: BotCtx) => onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkPhone))
);

export default addAdminScene