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
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../../constants");
const drivers_1 = __importDefault(require("../../schemas/drivers"));
const regional_orders_1 = __importDefault(require("../../schemas/regional-orders"));
const functions_1 = __importStar(require("../../utils/functions"));
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const driver = yield drivers_1.default.aggregate([
        { $match: { chatId: ctx.from.id } },
        { $lookup: { from: "qq_taxi_users", localField: "chatId", foreignField: "chatId", as: "users" } },
        { $addFields: { user: { $arrayElemAt: ["$users", 0] } } },
        { $project: { users: 0 } }
    ]);
    if (!driver.length || (driver.length && !((_a = driver[0]) === null || _a === void 0 ? void 0 : _a.user))) {
        yield ctx.answerCbQuery("Siz haydovchi emassiz!", { show_alert: true });
        return;
    }
    const data = ctx.update.callback_query.data.split("_")[3];
    const orderValue = yield regional_orders_1.default.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(data) } },
        { $lookup: { from: "qq_taxi_users", localField: "userId", foreignField: "chatId", as: "users" } },
        { $addFields: { user: { $arrayElemAt: ["$users", 0] } } },
        { $project: { users: 0 } }
    ]);
    if (!orderValue.length || (orderValue.length && !((_b = orderValue[0]) === null || _b === void 0 ? void 0 : _b.user))) {
        yield ctx.answerCbQuery("Buyurtmaga tegishli ma'lumotlar bilan muammo yuzaga keldi iltimos birozdan so'ng urinib ko'ring", { show_alert: true });
        return;
    }
    const order = orderValue[0];
    if (order && order.status === "pending") {
        const orderPricePercent = (0, functions_1.getPercent)(order.summa, order.summa >= 20000 ? constants_1.ENV.minPercent : constants_1.ENV.percent);
        if (driver[0].balance < orderPricePercent) {
            yield ctx.answerCbQuery(`Buyurtmani qabul qilish uchun pulingiz yetarli emas, sizga yana ${orderPricePercent - driver[0].balance} so'm kerak`, { show_alert: true });
            yield ctx.telegram.sendMessage(ctx.from.id, `Sizning ID raqamingiz ${ctx.from.id}\n\nBalansingizda ${driver[0].balance} so'm\n\nBalansni to'ldirish uchun quyidagi raqamga o'tkazing: \n- Click raqam: <code>+998 91 406 63 39</code> (Abdurahmon S.)\n\nQuyidagi Chekni yuborish tugmasiga o'ting va transfer chekini va ushbu ID ${ctx.from.id} ni menejerga yuboring`, {
                reply_markup: {
                    inline_keyboard: [[{ text: "📄 Chekni yuborish", url: constants_1.ENV.adminUrl }]]
                },
                parse_mode: "HTML"
            });
            return;
        }
        const infoText = (0, functions_1.regionalOrderInfo)(order);
        if (!infoText) {
            yield ctx.answerCbQuery("Buyurtmaga tegishli ma'lumotlar bilan muammo yuzaga keldi iltimos birozdan so'ng urinib ko'ring", { show_alert: true });
            return;
        }
        yield drivers_1.default.findOneAndUpdate({ chatId: ctx.from.id }, { $inc: { balance: -orderPricePercent } });
        yield regional_orders_1.default.findByIdAndUpdate(data, { driverId: ctx.from.id, status: "accepted" });
        yield ctx.editMessageText(`---🟢 QABUL QILINDI ---\n\n${infoText}\n\nMa'lumotlar Haydovchiga yuborildi.\n\nQabul qildi: ${driver[0].user.name}`);
        yield ctx.telegram.sendMessage(ctx.from.id, `---🟢 YANGI BUYURTMA---\n\n${infoText}\n\nTelefon: ${order.user.phone}`, {
            reply_markup: {
                inline_keyboard: [[{ text: "Kutib turibman", callback_data: `waiting_regional_${order._id}` }, { text: "Buyurtmachi profili", url: `https://t.me/${order.user.phone}` }]]
            }
        });
        yield ctx.telegram.sendMessage(order.userId, `---🟢 BUYURTMA QABUL QILINDI---\n\n${infoText}\n<b>Telefon:</b> ${order.user.phone}\n\n<b>---Haydovchi---</b>\n<b>Ismi:</b> ${driver[0].user.name}\n<b>Telefon:</b> ${driver[0].user.phone}\n<b>Mashina rusumi:</b> ${driver[0].carModel}\n<b>Mashina raqami:</b> ${driver[0].carNumber}`, {
            parse_mode: "HTML"
        });
    }
});
const acceptRegionalOrder = ctx => (0, functions_1.default)(ctx, handler);
exports.default = acceptRegionalOrder;
