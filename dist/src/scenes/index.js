"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const add_admin_1 = __importDefault(require("./admin/add-admin"));
const edit_driver_balance_1 = __importDefault(require("./admin/edit-driver-balance"));
const user_block_1 = __importDefault(require("./admin/user-block"));
const be_driver_1 = __importDefault(require("./driver/be-driver"));
const be_regional_driver_1 = __importDefault(require("./driver/be-regional-driver"));
const edit_driver_1 = __importDefault(require("./driver/edit-driver"));
const select_driver_type_1 = __importDefault(require("./driver/select-driver-type"));
const verify_driver_1 = __importDefault(require("./driver/verify-driver"));
const add_order_1 = __importDefault(require("./order/add-order"));
const add_regional_order_1 = __importDefault(require("./order/add-regional-order"));
const edit_order_1 = __importDefault(require("./order/edit-order"));
const edit_order_price_1 = __importDefault(require("./order/edit-order-price"));
const edit_regional_order_1 = __importDefault(require("./order/edit-regional-order"));
const edit_regional_order_price_1 = __importDefault(require("./order/edit-regional-order-price"));
const stage = new telegraf_1.Scenes.Stage();
const allScenes = (bot) => {
    // bot.use((ctx: BotCtx,next: Function) =>{
    //     const activeScene = ctx.session?.__scenes?.current;
    //     if(activeScene){
    //         const data = ctx?.update?.callback_query?.data;
    //         if(data){
    //             console.log(data);                
    //         }
    //     }
    //     next();
    // });
    //admin scene
    stage.register(add_admin_1.default);
    stage.register(edit_driver_balance_1.default);
    stage.register(user_block_1.default);
    //drivers scene
    stage.register(select_driver_type_1.default);
    stage.register(be_driver_1.default);
    stage.register(verify_driver_1.default);
    stage.register(edit_driver_1.default);
    stage.register(be_regional_driver_1.default);
    //order scenes
    stage.register(add_order_1.default);
    stage.register(edit_order_1.default);
    stage.register(edit_order_price_1.default);
    // regional order 
    stage.register(add_regional_order_1.default);
    stage.register(edit_regional_order_1.default);
    stage.register(edit_regional_order_price_1.default);
    bot.use(stage.middleware());
};
exports.default = allScenes;
