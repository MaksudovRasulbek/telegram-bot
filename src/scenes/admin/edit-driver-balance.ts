import { Scenes } from "telegraf";
import { BotCtx } from "../../types/context";
import handlerProvider, { replyWithBoldText, sceneLeave } from "../../utils/functions";
import SCENENAMES from "../../constants/scene-names";
import onlyTextMiddleware from "../../middlewares/only-text";
import DRIVERS from "../../schemas/drivers";
import { KEYBOARDS } from "../../constants";
import { startKeyboard } from "../../controllers/commands/start";


const enter = (ctx: BotCtx) =>{
    replyWithBoldText(ctx, "Haydovchi telegram idsini kiriting.");
    return ctx.wizard.next();
}

const checkId = async(ctx: BotCtx) =>{
    const text = ctx.message.text;
    if(isNaN(Number(text))){
        replyWithBoldText(ctx, "Raqam kiriting");
        return
    }
    const driver  = await DRIVERS.aggregate([
        {$match:{chatId: Number(text)}},
        {$lookup:{from: "qq_taxi_users",localField: "chatId",foreignField: "chatId",as: "users"}},
        {$addFields: {user: { $arrayElemAt: ["$users", 0] }}},
        {$project: {users: 0}}
    ]);
    
    if(!driver.length || (driver.length && !driver[0]?.user)){
        replyWithBoldText(ctx, `Foydalanuvchi topilmadi`);
        return
    }
    
    await replyWithBoldText(ctx, `Haydovchi ma'lumotlari: \n\nIsmi: ${driver[0]?.user?.name}\nTelefon raqami: ${driver[0]?.user?.phone}\nMashina rusumi: ${driver[0].carModel}\nMashina raqami: ${driver[0].carNumber}\nBalansi: ${driver[0].balance} \n\n\n\nQancha pul o'tkazish kerak (Namuna: <code>100000</code> bo'sh joysiz raqam kiriting!)`,[[{text:KEYBOARDS.cancel}]]);
    ctx.session.driverChatIdForEditBalance = Number(text);
    return ctx.wizard.next();
}

const editBalance = async(ctx: BotCtx) =>{
    const text = ctx.message.text;
    const driverChatId = ctx.session?.driverChatIdForEditBalance;
    if(!driverChatId){
        await replyWithBoldText(ctx, `Ma'lumotlar bilan ishlashda xatolik, boshidan boshlang`);
        await sceneLeave(ctx, true, false);
        await ctx.scene.reenter();
        return
    }
    const driver = await DRIVERS.findOne({chatId: driverChatId});
    
    if(!driver){
        replyWithBoldText(ctx, `Foydalanuvchi topilmadi`);
        await sceneLeave(ctx, true, false);
        await ctx.scene.reenter();
        return
    }
    await DRIVERS.findOneAndUpdate({chatId: driverChatId},{balance: driver.balance + Number(text)});
    const keyboard = await startKeyboard(ctx);
    await replyWithBoldText(ctx, "Haydovchi balansiga pul tushdi", keyboard);
    await ctx.telegram.sendMessage(driverChatId, `Moderator tomonidan sizga ${text} so'm pul berildi. Hozirgi balans: ${driver.balance + Number(text)}`);
    await sceneLeave(ctx, true, false);
}

const editBalanceScene = new Scenes.WizardScene(SCENENAMES.editDriverBalance,
    (ctx: BotCtx) => handlerProvider(ctx, enter),
    (ctx: BotCtx) => onlyTextMiddleware(ctx, () => handlerProvider(ctx, checkId)),
    (ctx: BotCtx) => onlyTextMiddleware(ctx, () => handlerProvider(ctx, editBalance)),
);

export default editBalanceScene