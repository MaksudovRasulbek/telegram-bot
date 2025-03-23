import { ENV, KEYBOARDS } from "../../constants";
import DRIVERS from "../../schemas/drivers";
import USERS from "../../schemas/users";
import { BotCtx } from "../../types/context";
import myFn, { replyWithBoldText } from "../../utils/functions";


export const startText = "Salom! Sizga qanday xizmatni taqdim eta olaman?";
export const startKeyboard =async (ctx: BotCtx) => {
    const user = await USERS.findOne({chatId: ctx.from.id});
    const driver = await DRIVERS.findOne({chatId: ctx.from.id});
    const isAdmin = ctx.from.id === ENV.adminId;
    const result = [
        [{text:KEYBOARDS.callTaxi}],
        [{text:KEYBOARDS.toBeTaxi, }],
        driver  && [{text: KEYBOARDS.pay}],
        [{text:KEYBOARDS.videoGuide,}],
        ctx.from.id === ENV.adminId && [{text:KEYBOARDS.payToDrive},{text:KEYBOARDS.addAdmin}],
        (user && user.status == "admin" || ctx.from.id === ENV.adminId) && [{text:KEYBOARDS.countUser}, {text: KEYBOARDS.monthlyBenefit}],
        ctx.from.id === ENV.adminId && [{text: KEYBOARDS.sendMsg}],
        isAdmin && [{text:KEYBOARDS.block},{text:KEYBOARDS.unblock}]
    ];    
    return result.filter(k => k)
}

const fn = async(ctx: BotCtx) =>{
    const keyboard = await startKeyboard(ctx);
    replyWithBoldText(ctx, startText,keyboard)
}

const startFn = (ctx) => myFn(ctx, fn);

export default startFn;