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
const users_1 = __importDefault(require("../../schemas/users"));
const functions_1 = __importStar(require("../../utils/functions"));
const functions_2 = require("../order/functions");
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const only_text_1 = __importDefault(require("../../middlewares/only-text"));
const enter = (ctx) => {
    (0, functions_1.replyWithBoldText)(ctx, "Userni telefon nomerini kiriting.");
    return ctx.wizard.next();
};
const checkPhone = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const text = ctx.message.text;
    const isAvailablePhoneNumber = (0, functions_2.checkPhoneNumber)(ctx, text);
    if (isAvailablePhoneNumber) {
        const user = yield users_1.default.findOne({ phone: text });
        if (!user) {
            (0, functions_1.replyWithBoldText)(ctx, `Foydalanuvchi topilmadi, botga kirgan foydalanuvchini kamida bir marotaba taksi buyurtma bermasa yoki haydovchi profil yaratmasa admin qilolmaysiz`);
            return;
        }
        if (user && user.status === "admin") {
            (0, functions_1.replyWithBoldText)(ctx, `${user.name} allaqachon admin qilingan`);
            return;
        }
        yield users_1.default.findOneAndUpdate({ phone: text }, { status: "admin" });
        yield (0, functions_1.replyWithBoldText)(ctx, `${user.name} (${text}) admin qilindi`);
        yield ctx.telegram.sendMessage(user.chatId, "Siz moderator tomonidan admin qilindingiz\n\n/start bosing");
        yield (0, functions_1.sceneLeave)(ctx, true, false);
    }
    else {
        return;
    }
});
const addAdminScene = new telegraf_1.Scenes.WizardScene(scene_names_1.default.addAdmin, (ctx) => (0, functions_1.default)(ctx, enter), (ctx) => (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkPhone)));
exports.default = addAdminScene;
