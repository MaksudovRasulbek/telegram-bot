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
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const checkAdmin = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (ctx.from.id !== constants_1.ENV.adminId) {
        if ((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.update) === null || _a === void 0 ? void 0 : _a.callback_query) === null || _b === void 0 ? void 0 : _b.data) {
            yield ctx.answerCbQuery("Siz admin emassiz", { show_alert: true });
            return;
        }
        ctx.reply("Siz admin emassiz");
        return;
    }
    next();
});
exports.default = checkAdmin;
