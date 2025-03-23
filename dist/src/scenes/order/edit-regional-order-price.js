"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const telegraf_1 = require("telegraf");
const constants_1 = require("../../constants");
const prices_1 = require("../../constants/prices");
const regions_1 = __importDefault(require("../../constants/regions"));
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const actions_1 = require("../../controllers/actions");
const start_1 = require("../../controllers/commands/start");
const regional_orders_1 = __importDefault(require("../../schemas/regional-orders"));
const functions_1 = __importStar(require("../../utils/functions"));
const functions_2 = require("./functions");
const checkOrderValues = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!((_a = ctx.session) === null || _a === void 0 ? void 0 : _a.regionalOrderIdForEditPrice)) {
        (0, functions_1.sceneLeave)(ctx, true, false);
        const keyboard = yield (0, start_1.startKeyboard)(ctx);
        (0, functions_1.replyWithBoldText)(ctx, "Ma'lumotlar bilan muammo yuzaga keldi, Iltimos boshidan taksi buyurtma qiling :)", keyboard);
        return;
    }
    if ((_c = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.update) === null || _b === void 0 ? void 0 : _b.callback_query) === null || _c === void 0 ? void 0 : _c.data) {
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
    const text = (_d = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _d === void 0 ? void 0 : _d.text;
    if (!text) {
        (0, functions_1.deleteMessage)(ctx);
        return;
    }
    next();
});
const enter = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const keyboards = (0, prices_1.regioanPriceButtons)();
    (0, functions_1.replyWithBoldText)(ctx, "Siz taklif qilgan narx ? Narxni pastdagilarni tanlab qoyishingiz ham mumkin.", keyboards);
    return ctx.wizard.next();
});
const checkValue = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const text = (_e = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _e === void 0 ? void 0 : _e.text;
    const isAvailableSum = (0, functions_2.checkSum)(ctx, text);
    if (isAvailableSum) {
        const order = yield regional_orders_1.default.findById(ctx.session.regionalOrderIdForEditPrice);
        if (!order) {
            (0, functions_1.replyWithBoldText)(ctx, "Ma'lumotlar bilan muammo yuzaga keldi, keyinroq urinib ko'ring");
            (0, functions_1.sceneLeave)(ctx, true, false);
            return;
        }
        if (order.status != "pending") {
            (0, functions_1.replyWithBoldText)(ctx, "Buyurtmangiz qabul qilingan, endi narxini o'zgartira olmaysiz");
            (0, functions_1.sceneLeave)(ctx, true, false);
            return;
        }
        const findGroup = regions_1.default.find(d => d.id == order.fromRegionId);
        const to = regions_1.default.find(r => r.id === order.toRegionId);
        if (!findGroup) {
            (0, functions_1.replyWithBoldText)(ctx, "Ma'lumotlar bilan muammo yuzaga keldi, keyinroq urinib ko'ring");
            (0, functions_1.sceneLeave)(ctx, true, false);
            return;
        }
        const infoText = (0, functions_1.regionalOrderInfo)(order);
        yield ctx.telegram.editMessageText(findGroup.chatId, order.messageId, "", `<b>---🛑 BEKOR QILINDI ---</b>\n\n\n${infoText}`, {
            parse_mode: "HTML"
        });
        const groupMessage = yield ctx.telegram.sendMessage(findGroup.chatId, `---🔶 YANGI BUYURTMA---\n\nQayerdan: ${findGroup.text} (${order.from})\nQayerga: ${to.text} (${order.to})\nNarxi: ${text}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Qabul qilish", callback_data: `accept_regional_order_${order._id}` }]
                ]
            }
        });
        yield regional_orders_1.default.findByIdAndUpdate(ctx.session.regionalOrderIdForEditPrice, { messageId: groupMessage.message_id, summa: text });
        yield (0, functions_1.replyWithInlineKeyboard)(ctx, `Javobni kuting\n\nBuyurtma ko'rib chiqilmoqda... \n\n- Haydovchi siz bilan bog'lanadi\n\n${ctx.from.first_name}, Qishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`, [[{ text: constants_1.KEYBOARDS.cancel, callback_data: `cancel_regional_order_${order._id}` }]]);
        yield (0, functions_1.sceneLeave)(ctx, true, false);
        const keyboard = yield (0, start_1.startKeyboard)(ctx);
        yield (0, functions_1.replyWithBoldText)(ctx, "🚕", keyboard);
        yield (0, functions_2.reSendRegionalOrder)(ctx, ctx.session.regionalOrderIdForEditPrice);
    }
});
const editRegionalOrderPriceScene = new telegraf_1.Scenes.WizardScene(scene_names_1.default.editRegionalOrderPrice, (ctx) => { (0, functions_1.default)(ctx, enter); }, (ctx) => { checkOrderValues(ctx, () => (0, functions_1.default)(ctx, checkValue)); });
exports.default = editRegionalOrderPriceScene;
