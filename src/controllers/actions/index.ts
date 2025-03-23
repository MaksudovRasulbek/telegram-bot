import { Telegraf } from "telegraf";
import checkAdmin from "../../middlewares/check-admin";
import userCheck from "../../middlewares/user-check";
import acceptOrder from "./accept-order";
import acceptRegionalOrder from "./accept-regional-order";
import cancelOrder from "./cancel-order";
import cancelRegionalOrder from "./cancel-regional-order";
import editOrderPrice from "./edit-order-price";
import editRegionalOrderPrice from "./edit-regional-order-price";
import userBlock from "./user-block";
import waiting from "./waiting";
import waitingRegionalOrder from "./waiting-regional-order";

export const actions = [
    {regex: /^cancel_order_(.{24}|.{0,23})$/, handler: cancelOrder},
    {regex: /^edit_order_(.{24}|.{0,23})$/, handler: editOrderPrice},
    {regex: /^accept_order_(.{24}|.{0,23})$/, handler: acceptOrder},
    {regex: /^waiting_(.{24}|.{0,23})$/, handler: waiting},
    {regex: /^cancel_regional_order_(.{24}|.{0,23})$/, handler: cancelRegionalOrder},
    {regex: /^edit_regional_order_(.{24}|.{0,23})$/, handler: editRegionalOrderPrice},
    {regex: /^accept_regional_order_(.{24}|.{0,23})$/, handler: acceptRegionalOrder},
    {regex: /^waiting_regional_(.{24}|.{0,23})$/, handler: waitingRegionalOrder},
    {regex: /^block_user_(.{24}|.{0,23})$/, handler: userBlock},
    {regex: /^unblock_user_(.{24}|.{0,23})$/, handler: userBlock},
]

const allActions = (bot: Telegraf) =>{
    bot.action(/^cancel_order_(.{24}|.{0,23})$/, userCheck, ctx=> cancelOrder(ctx));
    bot.action(/^edit_order_(.{24}|.{0,23})$/, userCheck, ctx=> editOrderPrice(ctx));
    bot.action(/^accept_order_(.{24}|.{0,23})$/, userCheck, ctx=> acceptOrder(ctx));
    bot.action(/^waiting_(.{24}|.{0,23})$/, userCheck, ctx=> waiting(ctx));
    
    bot.action(/^accept_regional_order_(.{24}|.{0,23})$/, userCheck, ctx=> acceptRegionalOrder(ctx));
    bot.action(/^cancel_regional_order_(.{24}|.{0,23})$/, userCheck, ctx=> cancelRegionalOrder(ctx));
    bot.action(/^edit_regional_order_(.{24}|.{0,23})$/, userCheck, ctx=> editRegionalOrderPrice(ctx));
    bot.action(/^waiting_regional_(.{24}|.{0,23})$/, userCheck, ctx=> waitingRegionalOrder(ctx));

    bot.action(/^block_user_(.{24}|.{0,23})$/,checkAdmin, userCheck, ctx=> userBlock(ctx));
    bot.action(/^unblock_user_(.{24}|.{0,23})$/,checkAdmin, userCheck, ctx=> userBlock(ctx));
}

export default allActions