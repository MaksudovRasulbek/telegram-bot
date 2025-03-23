"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const check_admin_1 = __importDefault(require("../../middlewares/check-admin"));
const user_check_1 = __importDefault(require("../../middlewares/user-check"));
const accept_order_1 = __importDefault(require("./accept-order"));
const accept_regional_order_1 = __importDefault(require("./accept-regional-order"));
const cancel_order_1 = __importDefault(require("./cancel-order"));
const cancel_regional_order_1 = __importDefault(require("./cancel-regional-order"));
const edit_order_price_1 = __importDefault(require("./edit-order-price"));
const edit_regional_order_price_1 = __importDefault(require("./edit-regional-order-price"));
const user_block_1 = __importDefault(require("./user-block"));
const waiting_1 = __importDefault(require("./waiting"));
const waiting_regional_order_1 = __importDefault(require("./waiting-regional-order"));
exports.actions = [
    { regex: /^cancel_order_(.{24}|.{0,23})$/, handler: cancel_order_1.default },
    { regex: /^edit_order_(.{24}|.{0,23})$/, handler: edit_order_price_1.default },
    { regex: /^accept_order_(.{24}|.{0,23})$/, handler: accept_order_1.default },
    { regex: /^waiting_(.{24}|.{0,23})$/, handler: waiting_1.default },
    { regex: /^cancel_regional_order_(.{24}|.{0,23})$/, handler: cancel_regional_order_1.default },
    { regex: /^edit_regional_order_(.{24}|.{0,23})$/, handler: edit_regional_order_price_1.default },
    { regex: /^accept_regional_order_(.{24}|.{0,23})$/, handler: accept_regional_order_1.default },
    { regex: /^waiting_regional_(.{24}|.{0,23})$/, handler: waiting_regional_order_1.default },
    { regex: /^block_user_(.{24}|.{0,23})$/, handler: user_block_1.default },
    { regex: /^unblock_user_(.{24}|.{0,23})$/, handler: user_block_1.default },
];
const allActions = (bot) => {
    bot.action(/^cancel_order_(.{24}|.{0,23})$/, user_check_1.default, ctx => (0, cancel_order_1.default)(ctx));
    bot.action(/^edit_order_(.{24}|.{0,23})$/, user_check_1.default, ctx => (0, edit_order_price_1.default)(ctx));
    bot.action(/^accept_order_(.{24}|.{0,23})$/, user_check_1.default, ctx => (0, accept_order_1.default)(ctx));
    bot.action(/^waiting_(.{24}|.{0,23})$/, user_check_1.default, ctx => (0, waiting_1.default)(ctx));
    bot.action(/^accept_regional_order_(.{24}|.{0,23})$/, user_check_1.default, ctx => (0, accept_regional_order_1.default)(ctx));
    bot.action(/^cancel_regional_order_(.{24}|.{0,23})$/, user_check_1.default, ctx => (0, cancel_regional_order_1.default)(ctx));
    bot.action(/^edit_regional_order_(.{24}|.{0,23})$/, user_check_1.default, ctx => (0, edit_regional_order_price_1.default)(ctx));
    bot.action(/^waiting_regional_(.{24}|.{0,23})$/, user_check_1.default, ctx => (0, waiting_regional_order_1.default)(ctx));
    bot.action(/^block_user_(.{24}|.{0,23})$/, check_admin_1.default, user_check_1.default, ctx => (0, user_block_1.default)(ctx));
    bot.action(/^unblock_user_(.{24}|.{0,23})$/, check_admin_1.default, user_check_1.default, ctx => (0, user_block_1.default)(ctx));
};
exports.default = allActions;
