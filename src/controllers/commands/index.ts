import { Telegraf } from "telegraf";
import startFn from "./start";
import getOrders from "./get-orders";
import userCheck from "../../middlewares/user-check";

//bu yerda barcha buyruqlar
const allCommands = (bot: Telegraf) =>{
    //start buyrug'iga javob
    bot.start(userCheck, ctx => startFn(ctx));

    //hali qabul qilinmagan buyurtmalarni ko'rish
    bot.command("my_orders", ctx => getOrders(ctx))
}

export default allCommands