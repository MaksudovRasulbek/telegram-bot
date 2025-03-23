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
const regions_1 = __importStar(require("../../constants/regions"));
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const only_phone_number_1 = __importDefault(require("../../middlewares/only-phone-number"));
const only_text_1 = __importDefault(require("../../middlewares/only-text"));
const functions_1 = __importStar(require("../../utils/functions"));
const constants_2 = require("./constants");
const functions_2 = require("./functions");
const enter = (ctx) => {
    const keyboards = (0, regions_1.regionButtons)();
    (0, functions_1.replyWithBoldText)(ctx, "Qayerdan ketasiz", keyboards);
    return ctx.wizard.next();
};
const checkRegion = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const text = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
    const find = regions_1.default.find(d => d.text === text);
    if (!find) {
        (0, functions_1.deleteMessage)(ctx);
        return;
    }
    ctx.session.callRegionalTaxi = { fromRegion: find };
    const buttons = (0, regions_1.regionButtons)(find.id);
    (0, functions_1.replyWithBoldText)(ctx, "Qayerga ketasiz", buttons, !buttons ? true : null);
    return ctx.wizard.next();
});
const checkRegionTo = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const text = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _b === void 0 ? void 0 : _b.text;
    if (text === ctx.session.callRegionalTaxi.fromRegion.text) {
        (0, functions_1.deleteMessage)(ctx);
        return;
    }
    const find = regions_1.default.find(d => d.text === text);
    if (!find) {
        (0, functions_1.deleteMessage)(ctx);
        return;
    }
    ctx.session.callRegionalTaxi.toRegion = find;
    const buttons = yield (0, constants_2.regionalOrderLocationButtons)(ctx, ctx.session.callRegionalTaxi.fromRegion.id);
    (0, functions_1.replyWithBoldText)(ctx, `${ctx.session.callRegionalTaxi.fromRegion.text}ni qayeridan ketasiz`, buttons, !buttons ? true : null);
    return ctx.wizard.next();
});
const checkFrom = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const text = (_c = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _c === void 0 ? void 0 : _c.text;
    ctx.session.callRegionalTaxi.from = text;
    const buttons = yield (0, constants_2.regionalOrderLocationButtons)(ctx, ctx.session.callRegionalTaxi.toRegion.id);
    (0, functions_1.replyWithBoldText)(ctx, `${ctx.session.callRegionalTaxi.toRegion.text}ni qayeriga ketasiz`, buttons, !buttons ? true : null);
    return ctx.wizard.next();
});
const checkTo = (ctx) => {
    var _a;
    const text = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
    ctx.session.callRegionalTaxi.to = text;
    const keyboards = (0, prices_1.regioanPriceButtons)();
    (0, functions_1.replyWithBoldText)(ctx, "Siz taklif qilgan narx ? Narxni pastdagilarni tanlab qoyishingiz ham mumkin.", keyboards);
    return ctx.wizard.next();
};
const checkPrice = (ctx) => {
    var _a;
    const text = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
    const isAvailableSum = (0, functions_2.checkSum)(ctx, text);
    if (isAvailableSum) {
        ctx.session.callRegionalTaxi.price = Number(text);
        (0, functions_1.replyWithBoldText)(ctx, "Siz bilan bog'lanish uchun raqamingizni tasdiqlang.", constants_2.requestContact);
        return ctx.wizard.next();
    }
};
const checkPhone = (ctx) => {
    var _a, _b, _c;
    const text = ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text) || ((_c = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _b === void 0 ? void 0 : _b.contact) === null || _c === void 0 ? void 0 : _c.phone_number);
    const isAvailablePhoneNumber = (0, functions_2.checkPhoneNumber)(ctx, text);
    if (isAvailablePhoneNumber) {
        ctx.session.callRegionalTaxi.phone = text.padStart(13, "+");
        const value = ctx.session.callRegionalTaxi;
        (0, functions_1.replyWithBoldText)(ctx, `Sizning ma'lumotlaringiz.\n\nQayerdan:${value.fromRegion.text} (${value.from})\nQayerga: ${value.toRegion.text} (${value.to})\nNarxi: ${value.price}\nTelefon: ${value.phone}\n\nBuyurtmani tasdiqlash uchun (✅ Buyurtma berish) tugmasini bosish kerak`, constants_2.submitOrderButtons);
        return ctx.wizard.next();
    }
};
const verify = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const text = (_d = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _d === void 0 ? void 0 : _d.text;
    //buyurtma berish tugmasi bosilganda
    if (text === constants_1.KEYBOARDS.addOrder) {
        yield (0, functions_2.createRegionalOrder)(ctx);
        return;
    }
    //O'zgartirish tugmasi bosilganda
    if (text === constants_1.KEYBOARDS.editOrder) {
        (0, functions_1.replyWithBoldText)(ctx, "Nimani o'zgartirishni hohlaysiz?", constants_2.editOrderButtons.map(b => [{ text: b.text }]));
        return;
    }
    //qaysi qiymatni o'zgartirishni hohlashini bilish uchun
    constants_2.editOrderButtons.forEach((b) => {
        if (b.text === text) {
            ctx.session.editRegionalOrderKey = b.key;
            ctx.scene.enter(scene_names_1.default.editRegionalOrder);
            return;
        }
    });
});
const addRegionalOrderScene = new telegraf_1.Scenes.WizardScene(scene_names_1.default.addRegionalOrder, (ctx) => { (0, functions_1.default)(ctx, enter); }, (ctx) => { (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkRegion)); }, (ctx) => { (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkRegionTo)); }, (ctx) => { (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkFrom)); }, (ctx) => { (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkTo)); }, (ctx) => { (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkPrice)); }, (ctx) => { (0, only_phone_number_1.default)(ctx, () => (0, functions_1.default)(ctx, checkPhone)); }, (ctx) => { (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, verify)); });
exports.default = addRegionalOrderScene;
