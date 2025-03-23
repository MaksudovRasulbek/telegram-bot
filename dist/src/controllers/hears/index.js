"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const check_admin_1 = __importDefault(require("../../middlewares/check-admin"));
const user_check_1 = __importDefault(require("../../middlewares/user-check"));
const start_1 = __importDefault(require("../commands/start"));
const add_admin_1 = __importDefault(require("./add-admin"));
const be_driver_1 = __importDefault(require("./be-driver"));
const call_taxi_1 = __importDefault(require("./call-taxi"));
const call_taxi_in_region_1 = __importDefault(require("./call-taxi-in-region"));
const call_taxi_out_region_1 = __importDefault(require("./call-taxi-out-region"));
const edit_driver_balance_1 = __importDefault(require("./edit-driver-balance"));
const monhtly_benefit_1 = __importDefault(require("./monhtly-benefit"));
const pay_1 = __importDefault(require("./pay"));
const user_block_1 = __importDefault(require("./user-block"));
const users_count_1 = __importDefault(require("./users-count"));
const allHears = (bot) => {
    // bot.hears(KEYBOARDS.videoGuide, ctx =>videoGuide(ctx));
    bot.hears(constants_1.KEYBOARDS.callTaxi, user_check_1.default, ctx => (0, call_taxi_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.inRegion, user_check_1.default, ctx => (0, call_taxi_in_region_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.accrosRegion, user_check_1.default, ctx => (0, call_taxi_out_region_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.mainMenu, user_check_1.default, ctx => (0, start_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.toBeTaxi, user_check_1.default, ctx => (0, be_driver_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.pay, user_check_1.default, ctx => (0, pay_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.countUser, user_check_1.default, ctx => (0, users_count_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.monthlyBenefit, user_check_1.default, ctx => (0, monhtly_benefit_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.addAdmin, check_admin_1.default, ctx => (0, add_admin_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.payToDrive, check_admin_1.default, ctx => (0, edit_driver_balance_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.block, check_admin_1.default, ctx => (0, user_block_1.default)(ctx));
    bot.hears(constants_1.KEYBOARDS.unblock, check_admin_1.default, ctx => (0, user_block_1.default)(ctx));
};
exports.default = allHears;
