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
const only_text_1 = __importDefault(require("../../middlewares/only-text"));
const drivers_1 = __importDefault(require("../../schemas/drivers"));
const constants_1 = require("../../constants");
const start_1 = require("../../controllers/commands/start");
const enter = (ctx) => {
    (0, functions_1.replyWithBoldText)(ctx, "Haydovchi telegram idsini kiriting.");
    return ctx.wizard.next();
};
const checkId = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const text = ctx.message.text;
    if (isNaN(Number(text))) {
        (0, functions_1.replyWithBoldText)(ctx, "Raqam kiriting");
        return;
    }
    const driver = yield drivers_1.default.aggregate([
        { $match: { chatId: Number(text) } },
        { $lookup: { from: "qq_taxi_users", localField: "chatId", foreignField: "chatId", as: "users" } },
        { $addFields: { user: { $arrayElemAt: ["$users", 0] } } },
        { $project: { users: 0 } }
    ]);
    if (!driver.length || (driver.length && !((_a = driver[0]) === null || _a === void 0 ? void 0 : _a.user))) {
        (0, functions_1.replyWithBoldText)(ctx, `Foydalanuvchi topilmadi`);
        return;
    }
    yield (0, functions_1.replyWithBoldText)(ctx, `Haydovchi ma'lumotlari: \n\nIsmi: ${(_c = (_b = driver[0]) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.name}\nTelefon raqami: ${(_e = (_d = driver[0]) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.phone}\nMashina rusumi: ${driver[0].carModel}\nMashina raqami: ${driver[0].carNumber}\nBalansi: ${driver[0].balance} \n\n\n\nQancha pul o'tkazish kerak (Namuna: <code>100000</code> bo'sh joysiz raqam kiriting!)`, [[{ text: constants_1.KEYBOARDS.cancel }]]);
    ctx.session.driverChatIdForEditBalance = Number(text);
    return ctx.wizard.next();
});
const editBalance = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const text = ctx.message.text;
    const driverChatId = (_f = ctx.session) === null || _f === void 0 ? void 0 : _f.driverChatIdForEditBalance;
    if (!driverChatId) {
        yield (0, functions_1.replyWithBoldText)(ctx, `Ma'lumotlar bilan ishlashda xatolik, boshidan boshlang`);
        yield (0, functions_1.sceneLeave)(ctx, true, false);
        yield ctx.scene.reenter();
        return;
    }
    const driver = yield drivers_1.default.findOne({ chatId: driverChatId });
    if (!driver) {
        (0, functions_1.replyWithBoldText)(ctx, `Foydalanuvchi topilmadi`);
        yield (0, functions_1.sceneLeave)(ctx, true, false);
        yield ctx.scene.reenter();
        return;
    }
    yield drivers_1.default.findOneAndUpdate({ chatId: driverChatId }, { balance: driver.balance + Number(text) });
    const keyboard = yield (0, start_1.startKeyboard)(ctx);
    yield (0, functions_1.replyWithBoldText)(ctx, "Haydovchi balansiga pul tushdi", keyboard);
    yield ctx.telegram.sendMessage(driverChatId, `Moderator tomonidan sizga ${text} so'm pul berildi. Hozirgi balans: ${driver.balance + Number(text)}`);
    yield (0, functions_1.sceneLeave)(ctx, true, false);
});
const editBalanceScene = new telegraf_1.Scenes.WizardScene(scene_names_1.default.editDriverBalance, (ctx) => (0, functions_1.default)(ctx, enter), (ctx) => (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkId)), (ctx) => (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, editBalance)));
exports.default = editBalanceScene;
