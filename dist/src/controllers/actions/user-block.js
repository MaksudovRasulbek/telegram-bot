"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const users_1 = __importDefault(require("../../schemas/users"));
const functions_1 = __importDefault(require("../../utils/functions"));
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const data = ctx.update.callback_query.data.split("_");
    const type = data[0];
    const userId = parseInt(data[2]);
    if (userId === constants_1.ENV.adminId) {
        yield ctx.answerCbQuery("Adminnni bloklay olmaysiz", { show_alert: true });
        return;
    }
    const user = yield users_1.default.findOne({ chatId: userId });
    if (!user) {
        yield ctx.answerCbQuery("Foydalanuvchi bazada mavjud emas", { show_alert: true });
        return;
    }
    user.status = type === "block" ? "blocked" : "user";
    yield user.save();
    yield ctx.answerCbQuery(`Yaxshi ${user.name} ${type === "block" ? "bloklandi" : "blokdan chiqarildi"}`, { show_alert: true });
    yield ctx.editMessageReplyMarkup({
        inline_keyboard: [
            [
                { text: user.status === "blocked" ? "Blokdan chiqarish" : "Bloklash", callback_data: user.status === "blocked" ? `unblock_user_${user.chatId}` : `block_user_${user.chatId}` },
                { text: "Foydalanuvchi profili", url: `t.me/${user.phone}` }
            ]
        ]
    });
});
const userBlock = ctx => (0, functions_1.default)(ctx, handler);
exports.default = userBlock;
