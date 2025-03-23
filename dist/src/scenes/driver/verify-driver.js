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
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const start_1 = require("../../controllers/commands/start");
const only_text_1 = __importDefault(require("../../middlewares/only-text"));
const functions_1 = __importStar(require("../../utils/functions"));
const constants_2 = require("./constants");
const functions_2 = require("./functions");
const enter = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const value = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.beDriverValue;
    if (!value) {
        const keyboard = yield (0, start_1.startKeyboard)(ctx);
        (0, functions_1.replyWithBoldText)(ctx, "Ma'lumotlar bilan muammo yuzaga keldi keyinroq urinib ko'ring", keyboard);
        (0, functions_1.sceneLeave)(ctx, true, false);
        return;
    }
    (0, functions_1.replyWithBoldText)(ctx, `Ilovani tasdiqlang. \n\nIsmi:  ${value.name}\nTelefon:  ${value.phone}\nAvtomobil modeli:  ${value.carModel}\nAvtomobil raqami:  ${value.carNumber}\n${((_c = (_b = ctx.session) === null || _b === void 0 ? void 0 : _b.beDriverValue) === null || _c === void 0 ? void 0 : _c.type) === "regional" ? "Viloyat" : "Tuman"}:  ${value.district.text}\n\nIlovani tasdiqlash uchun "${constants_1.KEYBOARDS.confirm}" tugmasini bosish kerak`, constants_2.submitDriverButtons);
    return ctx.wizard.next();
});
const verify = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const text = ctx.message.text;
    if (text === constants_1.KEYBOARDS.confirm) {
        yield (0, functions_2.createDriver)(ctx);
        return;
    }
    if (text === constants_1.KEYBOARDS.editOrder) {
        (0, functions_1.replyWithBoldText)(ctx, "Nimani o'zgartirishni hohlaysiz?", constants_2.editDriverButtons.map(b => [{ text: b.text }]));
        return;
    }
    //qaysi qiymatni o'zgartirishni hohlashini bilish uchun
    constants_2.editDriverButtons.forEach((b) => {
        if (b.text === text) {
            ctx.session.editDriverKey = b.key;
            ctx.scene.enter(scene_names_1.default.editDriver);
            return;
        }
    });
});
const verifyDriverScene = new telegraf_1.Scenes.WizardScene(scene_names_1.default.verifyDriver, (ctx) => { (0, functions_1.default)(ctx, enter); }, (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, verify)); }));
exports.default = verifyDriverScene;
