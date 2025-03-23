import { Telegraf } from "telegraf";
import { KEYBOARDS } from "../../constants";
import checkAdmin from "../../middlewares/check-admin";
import userCheck from "../../middlewares/user-check";
import startFn from "../commands/start";
import addAdmin from "./add-admin";
import beDriver from "./be-driver";
import callTaxi from "./call-taxi";
import callTaxiInRegion from "./call-taxi-in-region";
import callTaxiOutRegion from "./call-taxi-out-region";
import editDriverBalance from "./edit-driver-balance";
import monthlyBenefit from "./monhtly-benefit";
import pay from "./pay";
import userBlock from "./user-block";
import usersCount from "./users-count";

const allHears = (bot : Telegraf) =>{
    // bot.hears(KEYBOARDS.videoGuide, ctx =>videoGuide(ctx));
    bot.hears(KEYBOARDS.callTaxi, userCheck,  ctx =>callTaxi(ctx));
    bot.hears(KEYBOARDS.inRegion, userCheck,  ctx =>callTaxiInRegion(ctx));
    bot.hears(KEYBOARDS.accrosRegion, userCheck,  ctx =>callTaxiOutRegion(ctx));
    bot.hears(KEYBOARDS.mainMenu, userCheck,  ctx => startFn(ctx));
    bot.hears(KEYBOARDS.toBeTaxi, userCheck,  ctx => beDriver(ctx));
    bot.hears(KEYBOARDS.pay, userCheck,  ctx => pay(ctx));
    bot.hears(KEYBOARDS.countUser, userCheck,  ctx => usersCount(ctx));
    bot.hears(KEYBOARDS.monthlyBenefit, userCheck, ctx => monthlyBenefit(ctx));
    bot.hears(KEYBOARDS.addAdmin, checkAdmin,   ctx => addAdmin(ctx));
    bot.hears(KEYBOARDS.payToDrive, checkAdmin,  ctx => editDriverBalance(ctx));
    bot.hears(KEYBOARDS.block,checkAdmin, ctx => userBlock(ctx));
    bot.hears(KEYBOARDS.unblock, checkAdmin,  ctx => userBlock(ctx));
}
export default allHears