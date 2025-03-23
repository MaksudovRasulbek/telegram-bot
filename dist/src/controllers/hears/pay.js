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
const constants_1 = require("../../constants");
const drivers_1 = __importDefault(require("../../schemas/drivers"));
const functions_1 = __importStar(require("../../utils/functions"));
const start_1 = require("../commands/start");
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield drivers_1.default.findOne({ chatId: ctx.from.id });
    if (!driver) {
        const keyboard = yield (0, start_1.startKeyboard)(ctx);
        (0, functions_1.replyWithBoldText)(ctx, "Siz haydovchi profiliga ega emassiz", keyboard);
        return;
    }
    (0, functions_1.replyWithInlineKeyboard)(ctx, `Sizning ID raqamingiz ${ctx.from.id}\n\nBalansingizda ${driver.balance} so'm\n\nBalansni to'ldirish uchun quyidagi raqamga o'tkazing: \n- Click raqam: <code>+998 91 406 63 39</code> (Abdurahmon S.)\n\nQuyidagi Chekni yuborish tugmasiga o'ting va transfer chekini va ushbu ID ${ctx.from.id} ni menejerga yuboring`, [
        [{ text: "📄 Chekni yuborish", url: constants_1.ENV.adminUrl }]
    ]);
});
const pay = ctx => (0, functions_1.default)(ctx, handler);
exports.default = pay;
