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
const districts_1 = __importStar(require("../../constants/districts"));
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const only_phone_number_1 = __importDefault(require("../../middlewares/only-phone-number"));
const only_text_1 = __importDefault(require("../../middlewares/only-text"));
const drivers_1 = __importDefault(require("../../schemas/drivers"));
const functions_1 = __importStar(require("../../utils/functions"));
const constants_1 = require("../order/constants");
const functions_2 = require("../order/functions");
const functions_3 = require("./functions");
const enter = (ctx) => {
    const keyboards = (0, districts_1.districtButtons)();
    (0, functions_1.replyWithBoldText)(ctx, "Tumanni tanlang", keyboards);
    return ctx.wizard.next();
};
const checkDistrict = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const text = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text;
    const findDistrict = districts_1.default.find(d => d.text === text);
    if (!findDistrict) {
        (0, functions_1.deleteMessage)(ctx);
        return;
    }
    ctx.session.beDriverValue = { district: findDistrict };
    const driver = yield drivers_1.default.aggregate([
        { $match: {
                chatId: ctx.from.id
            } },
        {
            $lookup: {
                from: "qq_taxi_users",
                localField: "chatId",
                foreignField: "chatId",
                as: "users"
            }
        },
        {
            $addFields: {
                user: { $arrayElemAt: ["$users", 0] }
            }
        },
        {
            $project: {
                users: 0 // Exclude the liked_movies array field
            }
        }
    ]);
    if (driver.length && ((_b = driver[0]) === null || _b === void 0 ? void 0 : _b.user)) {
        ctx.session.beDriverValue.carModel = driver[0].carModel;
        ctx.session.beDriverValue.carNumber = driver[0].carNumber;
        ctx.session.beDriverValue.district = findDistrict;
        ctx.session.beDriverValue.name = driver[0].user.name;
        ctx.session.beDriverValue.phone = driver[0].user.phone;
        ctx.scene.enter(scene_names_1.default.verifyDriver);
        return;
    }
    (0, functions_1.replyWithBoldText)(ctx, "Ism familiyangizni kiriting.", null, true);
    return ctx.wizard.next();
});
const checkName = (ctx) => {
    ctx.session.beDriverValue.name = ctx.message.text;
    (0, functions_1.replyWithBoldText)(ctx, "Siz bilan bog'lanish uchun raqamingizni tasdiqlang.", constants_1.requestContact);
    return ctx.wizard.next();
};
const checkPhone = (ctx) => {
    var _a, _b, _c;
    const text = ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.text) || ((_c = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _b === void 0 ? void 0 : _b.contact) === null || _c === void 0 ? void 0 : _c.phone_number);
    const isAvailablePhoneNumber = (0, functions_2.checkPhoneNumber)(ctx, text);
    if (isAvailablePhoneNumber) {
        ctx.session.beDriverValue.phone = text.padStart(13, "+");
        (0, functions_1.replyWithBoldText)(ctx, "Mashina rusumini kiriting (Masalan: Jentra qora).", null, true);
        return ctx.wizard.next();
    }
};
const checkCarModel = (ctx) => {
    const text = ctx.message.text;
    const isAvailableCarModel = (0, functions_3.checkAvailableCarModel)(ctx, text);
    if (isAvailableCarModel) {
        ctx.session.beDriverValue.carModel = text;
        (0, functions_1.replyWithBoldText)(ctx, "Mashina raqamini kiriting (Masalan: 156 AFT).", null, true);
        return ctx.wizard.next();
    }
    else {
        return;
    }
};
const checkCarNumber = (ctx) => {
    ctx.session.beDriverValue.carNumber = ctx.message.text;
    return ctx.scene.enter(scene_names_1.default.verifyDriver);
};
const beDriverScene = new telegraf_1.Scenes.WizardScene(scene_names_1.default.beDriver, (ctx) => __awaiter(void 0, void 0, void 0, function* () { (0, functions_1.default)(ctx, enter); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkDistrict)); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkName)); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield (0, only_phone_number_1.default)(ctx, () => (0, functions_1.default)(ctx, checkPhone)); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkCarModel)); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkCarNumber)); }));
exports.default = beDriverScene;
