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
const users_1 = __importDefault(require("../schemas/users"));
const userCheck = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield users_1.default.findOne({ chatId: ctx.from.id });
    if (user && user.status === "blocked") {
        const text = "Afsuski, siz qora ro'yxatga tushdingiz 😔. Qora ro'yxatdan chiqish uchun ushbu adminga yozing @DeveloperAbdurahmon";
        if ((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.update) === null || _a === void 0 ? void 0 : _a.callback_query) === null || _b === void 0 ? void 0 : _b.data) {
            yield ctx.answerCbQuery(text, { show_alert: true });
            return;
        }
        yield ctx.reply(text);
        return;
    }
    next();
});
exports.default = userCheck;
