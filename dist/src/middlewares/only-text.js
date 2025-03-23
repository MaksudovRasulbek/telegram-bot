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
const actions_1 = require("../controllers/actions");
const functions_1 = require("../utils/functions");
const onlyTextMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if ((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.update) === null || _a === void 0 ? void 0 : _a.callback_query) === null || _b === void 0 ? void 0 : _b.data) {
        const callbackData = ctx.update.callback_query.data;
        // Check if callbackData matches any regex in actions
        for (const action of actions_1.actions) {
            if (action.regex.test(callbackData)) {
                yield action.handler(ctx);
                return; // Stop further execution
            }
        }
        ctx.answerCbQuery("Jarayonni tugatmasdan turib, inline tugmalarni ishlata olmaysiz :(", { show_alert: true });
        return;
    }
    const text = (_c = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _c === void 0 ? void 0 : _c.text;
    if (!text) {
        (0, functions_1.deleteMessage)(ctx);
        return;
    }
    yield next();
});
exports.default = onlyTextMiddleware;
