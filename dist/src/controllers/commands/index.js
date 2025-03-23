"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const start_1 = __importDefault(require("./start"));
const get_orders_1 = __importDefault(require("./get-orders"));
const user_check_1 = __importDefault(require("../../middlewares/user-check"));
//bu yerda barcha buyruqlar
const allCommands = (bot) => {
    //start buyrug'iga javob
    bot.start(user_check_1.default, ctx => (0, start_1.default)(ctx));
    //hali qabul qilinmagan buyurtmalarni ko'rish
    bot.command("my_orders", ctx => (0, get_orders_1.default)(ctx));
};
exports.default = allCommands;
