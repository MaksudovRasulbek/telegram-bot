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
exports.startKeyboard = exports.startText = void 0;
const constants_1 = require("../../constants");
const drivers_1 = __importDefault(require("../../schemas/drivers"));
const users_1 = __importDefault(require("../../schemas/users"));
const functions_1 = __importStar(require("../../utils/functions"));
exports.startText = "Salom! Sizga qanday xizmatni taqdim eta olaman?";
const startKeyboard = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ chatId: ctx.from.id });
    const driver = yield drivers_1.default.findOne({ chatId: ctx.from.id });
    const isAdmin = ctx.from.id === constants_1.ENV.adminId;
    const result = [
        [{ text: constants_1.KEYBOARDS.callTaxi }],
        [{ text: constants_1.KEYBOARDS.toBeTaxi, }],
        driver && [{ text: constants_1.KEYBOARDS.pay }],
        [{ text: constants_1.KEYBOARDS.videoGuide, }],
        ctx.from.id === constants_1.ENV.adminId && [{ text: constants_1.KEYBOARDS.payToDrive }, { text: constants_1.KEYBOARDS.addAdmin }],
        (user && user.status == "admin" || ctx.from.id === constants_1.ENV.adminId) && [{ text: constants_1.KEYBOARDS.countUser }, { text: constants_1.KEYBOARDS.monthlyBenefit }],
        ctx.from.id === constants_1.ENV.adminId && [{ text: constants_1.KEYBOARDS.sendMsg }],
        isAdmin && [{ text: constants_1.KEYBOARDS.block }, { text: constants_1.KEYBOARDS.unblock }]
    ];
    return result.filter(k => k);
});
exports.startKeyboard = startKeyboard;
const fn = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const keyboard = yield (0, exports.startKeyboard)(ctx);
    (0, functions_1.replyWithBoldText)(ctx, exports.startText, keyboard);
});
const startFn = (ctx) => (0, functions_1.default)(ctx, fn);
exports.default = startFn;
