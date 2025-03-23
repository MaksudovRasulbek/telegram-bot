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
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const constants_1 = require("../order/constants");
const functions_2 = require("../order/functions");
const functions_3 = require("./functions");
const only_phone_number_1 = __importDefault(require("../../middlewares/only-phone-number"));
const enter = (ctx) => {
    const key = ctx.session.editDriverKey;
    if (key === "name") {
        (0, functions_1.replyWithBoldText)(ctx, "Ism familiyangizni kiriting.", null, true);
    }
    if (key === "phoneNumber") {
        (0, functions_1.replyWithBoldText)(ctx, "Siz bilan bog'lanish uchun raqamingizni tasdiqlang.", constants_1.requestContact);
    }
    if (key === "carModel") {
        (0, functions_1.replyWithBoldText)(ctx, "Mashina rusumini kiriting (Masalan: Jentra qora).", null, true);
    }
    if (key === "carNumber") {
        (0, functions_1.replyWithBoldText)(ctx, "Mashina raqamini kiriting (Masalan: 156 AFT).", null, true);
    }
    return ctx.wizard.next();
};
const check = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const key = ctx.session.editDriverKey;
    const text = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) || ((_c = (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.contact) === null || _c === void 0 ? void 0 : _c.phone_number);
    if (key === "name") {
        ctx.session.beDriverValue.name = ctx.message.text;
    }
    if (key === "phoneNumber") {
        const isAvailablePhoneNumber = (0, functions_2.checkPhoneNumber)(ctx, text);
        if (isAvailablePhoneNumber) {
            ctx.session.beDriverValue.phone = text.padStart(13, "+");
        }
        else {
            return;
        }
    }
    if (key === "carModel") {
        const isAvailableCarModel = (0, functions_3.checkAvailableCarModel)(ctx, text);
        if (isAvailableCarModel) {
            ctx.session.beDriverValue.carModel = text;
        }
        else {
            return;
        }
    }
    if (key === "carNumber") {
        ctx.session.beDriverValue.carNumber = text;
    }
    return ctx.scene.enter(scene_names_1.default.verifyDriver);
});
const editDriverScene = new telegraf_1.Scenes.WizardScene(scene_names_1.default.editDriver, (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield (0, functions_3.checkSessionValueMiddleware)(ctx, () => (0, functions_1.default)(ctx, enter)); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield (0, only_phone_number_1.default)(ctx, () => (0, functions_1.default)(ctx, check)); }));
exports.default = editDriverScene;
