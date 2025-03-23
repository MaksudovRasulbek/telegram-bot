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
exports.regionalOrderInfo = exports.sleep = exports.getPercent = exports.sceneLeave = exports.deleteMessage = exports.chunkArray = exports.replyWithInlineKeyboard = exports.replyWithBoldText = void 0;
const constants_1 = require("../constants");
const regions_1 = __importDefault(require("../constants/regions"));
const start_1 = require("../controllers/commands/start");
/**
 * Bu funktsiya xatolarni ushlab olish va foydalanuvchiga tushunarli qilib javob berish uchun mo'ljallangan.
 *
 * @param {BotCtx} ctx - Telegram bot konteksti (foydalanuvchi ma'lumotlari va boshqalar)
 * @param {Function} handler - asosiy ishlovchi funktsiya
 *
 * Agar ishlov berish jarayonida xatolik yuzaga kelsa, u ushlanib, quyidagicha ishlanadi:
 *  - Xatolik konsolga yoziladi
 *  - Foydalanuvchiga "Sizda xatolik chiqdi" degan xabar yuboriladi
 *  - Xatolik matni foydalanuvchiga tushunarli qilib ko'rsatiladi (String(e) funktsiyasi yordamida)
 */
const handlerProvider = (ctx, handler) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const currentScene = (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.__scenes) === null || _b === void 0 ? void 0 : _b.current;
        if (currentScene) {
            const text = (_c = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _c === void 0 ? void 0 : _c.text;
            if (text) {
                if (text === constants_1.KEYBOARDS.mainMenu || text === "/start") {
                    (0, exports.sceneLeave)(ctx, true, true);
                    return;
                }
                if (text === constants_1.KEYBOARDS.cancel) {
                    yield (0, exports.replyWithBoldText)(ctx, "Yaxshi, bekor qilindi.", null, true);
                    yield (0, exports.sceneLeave)(ctx, true, true);
                    return;
                }
            }
        }
        handler(ctx);
    }
    catch (e) {
        console.log(e);
        ctx.reply(`Sizda xatolik chiqdi\n\nXatolik matni : ${String(e)}`);
        const currentScene = (_e = (_d = ctx.session) === null || _d === void 0 ? void 0 : _d.__scenes) === null || _e === void 0 ? void 0 : _e.current;
        if (currentScene) {
            (0, exports.sceneLeave)(ctx, true, true);
        }
    }
});
exports.default = handlerProvider;
const replyWithBoldText = (ctx, txt, keyboards, remove) => ctx.reply(txt, {
    parse_mode: "HTML",
    reply_markup: {
        keyboard: keyboards || [],
        resize_keyboard: true,
        remove_keyboard: remove
    }
});
exports.replyWithBoldText = replyWithBoldText;
const replyWithInlineKeyboard = (ctx, txt, keyboards, remove) => ctx.reply(txt, {
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: keyboards || [],
        remove_keyboard: remove
    }
});
exports.replyWithInlineKeyboard = replyWithInlineKeyboard;
const chunkArray = (arr, columnSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += columnSize) {
        const items = arr.slice(i, i + columnSize);
        result.push(items);
    }
    return result;
};
exports.chunkArray = chunkArray;
const deleteMessage = (ctx) => {
    try {
        ctx.deleteMessage().catch((e) => e);
    }
    catch (e) {
        console.log(`Xabarni o'chirishdagi xato: ${e}`);
    }
};
exports.deleteMessage = deleteMessage;
const sceneLeave = (ctx, removeSession, start) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.scene.leave();
    if (removeSession) {
        ctx.session = {};
    }
    if (start) {
        const keyboard = yield (0, start_1.startKeyboard)(ctx);
        (0, exports.replyWithBoldText)(ctx, start_1.startText, keyboard);
    }
});
exports.sceneLeave = sceneLeave;
const getPercent = (number, percent) => (number * percent) / 100;
exports.getPercent = getPercent;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
const regionalOrderInfo = (order) => {
    try {
        const from = regions_1.default.find(r => r.id === order.fromRegionId);
        const to = regions_1.default.find(r => r.id === order.toRegionId);
        if (from && to) {
            return `Qayerdan: ${from.text} (${order.from})\nQayerga: ${to.text} (${order.to})\nNarxi: ${order.summa}`;
        }
        else {
            return null;
        }
    }
    catch (_a) {
        return null;
    }
};
exports.regionalOrderInfo = regionalOrderInfo;
