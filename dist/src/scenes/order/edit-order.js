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
const functions_1 = __importStar(require("../../utils/functions"));
const start_1 = require("../../controllers/commands/start");
const constants_1 = require("./constants");
const prices_1 = require("../../constants/prices");
const constants_2 = require("../../constants");
const functions_2 = require("./functions");
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const actions_1 = require("../../controllers/actions");
const checkOrderValues = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!((_a = ctx.session) === null || _a === void 0 ? void 0 : _a.callTaxi) || !((_c = (_b = ctx.session) === null || _b === void 0 ? void 0 : _b.editOrder) === null || _c === void 0 ? void 0 : _c.key)) {
        (0, functions_1.sceneLeave)(ctx, true, false);
        const keyboard = yield (0, start_1.startKeyboard)(ctx);
        (0, functions_1.replyWithBoldText)(ctx, "Ma'lumotlar bilan muammo yuzaga keldi, Iltimos boshidan taksi buyurtma qiling :)", keyboard);
        return;
    }
    if ((_e = (_d = ctx === null || ctx === void 0 ? void 0 : ctx.update) === null || _d === void 0 ? void 0 : _d.callback_query) === null || _e === void 0 ? void 0 : _e.data) {
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
    const text = ((_f = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _f === void 0 ? void 0 : _f.text) || ((_g = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _g === void 0 ? void 0 : _g.contact);
    if (!text) {
        (0, functions_1.deleteMessage)(ctx);
        return;
    }
    next();
});
const enter = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const key = ctx.session.editOrder.key;
    if (key === "from") {
        const buttons = yield (0, constants_1.orderLocationButtons)(ctx, ctx.session.callTaxi.district.id);
        (0, functions_1.replyWithBoldText)(ctx, "Qayerdan ketasiz", buttons, !buttons ? true : null);
    }
    if (key === "to") {
        const buttons = yield (0, constants_1.orderLocationButtons)(ctx, ctx.session.callTaxi.district.id);
        (0, functions_1.replyWithBoldText)(ctx, "Qayerga ketasiz", buttons, !buttons ? true : null);
    }
    if (key === "price") {
        const keyboards = (0, prices_1.priceButtons)();
        (0, functions_1.replyWithBoldText)(ctx, "Siz taklif qilgan narx ? Narxni pastdagilarni tanlab qoyishingiz ham mumkin.", keyboards);
    }
    if (key === "phoneNumber") {
        (0, functions_1.replyWithBoldText)(ctx, "Siz bilan bog'lanish uchun raqamingizni tasdiqlang.", constants_1.requestContact);
    }
    return ctx.wizard.next();
});
const checkValue = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l;
    const key = ctx.session.editOrder.key;
    const text = (_h = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _h === void 0 ? void 0 : _h.text;
    if (key === "from") {
        ctx.session.callTaxi.from = text;
    }
    if (key === "to") {
        ctx.session.callTaxi.to = text;
    }
    if (key === "price") {
        const sumRegex = new RegExp(/^[1-9]\d*$/);
        if (!sumRegex.test(text)) {
            (0, functions_1.replyWithBoldText)(ctx, "Iltimos narxni to'gri kiriting, so'z qo'shmasdan, orasini ochmasdan shunchaki raqamlar orqali. \n\nNamuna : 10000");
            return;
        }
        if (Number(text) < 1000) {
            (0, functions_1.replyWithBoldText)(ctx, "Narx juda ham kam, sal qimmatroq narx belgilang:");
            return;
        }
        if (Number(text) > 5000000) {
            (0, functions_1.replyWithBoldText)(ctx, "Narx juda ham baland, sal arzonroq narx belgilang:");
            return;
        }
        ctx.session.callTaxi.price = Number(text);
    }
    if (key === "phoneNumber") {
        const txt = ((_j = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _j === void 0 ? void 0 : _j.text) || ((_l = (_k = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _k === void 0 ? void 0 : _k.contact) === null || _l === void 0 ? void 0 : _l.phone_number);
        const isAvailablePhoneNumber = (0, functions_2.checkPhoneNumber)(ctx, txt);
        if (isAvailablePhoneNumber) {
            ctx.session.callTaxi.phone = txt.padStart(13, "+");
        }
        else {
            return;
        }
    }
    const value = ctx.session.callTaxi;
    (0, functions_1.replyWithBoldText)(ctx, `Sizning ma'lumotlaringiz.\n\nQayerdan: ${value.from}\nQayerga: ${value.to}\nNarxi: ${value.price}\nTelefon: ${value.phone}\n\nBuyurtmani tasdiqlash uchun (✅ Buyurtma berish) tugmasini bosish kerak`, constants_1.submitOrderButtons);
    return ctx.wizard.next();
});
const verify = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const text = ctx.message.text;
    //buyurtma berish tugmasi bosilganda
    if (text === constants_2.KEYBOARDS.addOrder) {
        yield (0, functions_2.createOrder)(ctx);
        return;
    }
    //O'zgartirish tugmasi bosilganda
    if (text === constants_2.KEYBOARDS.editOrder) {
        (0, functions_1.replyWithBoldText)(ctx, "Nimani o'zgartirishni hohlaysiz?", constants_1.editOrderButtons.map(b => [{ text: b.text }]));
        return;
    }
    //qaysi qiymatni o'zgartirishni hohlashini bilish uchun
    constants_1.editOrderButtons.forEach((b) => {
        if (b.text === text) {
            ctx.session.editOrder = { key: b.key };
            ctx.scene.enter(scene_names_1.default.editOrder);
            return;
        }
    });
});
const editOrderScene = new telegraf_1.Scenes.WizardScene(scene_names_1.default.editOrder, (ctx) => { checkOrderValues(ctx, () => (0, functions_1.default)(ctx, enter)); }, (ctx) => { checkOrderValues(ctx, () => (0, functions_1.default)(ctx, checkValue)); }, (ctx) => { checkOrderValues(ctx, () => (0, functions_1.default)(ctx, verify)); });
exports.default = editOrderScene;
