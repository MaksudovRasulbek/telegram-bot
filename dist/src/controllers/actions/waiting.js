"use strict";
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
const orders_1 = __importDefault(require("../../schemas/orders"));
const drivers_1 = __importDefault(require("../../schemas/drivers"));
const functions_1 = __importDefault(require("../../utils/functions"));
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const data = ctx.update.callback_query.data.split("_")[1];
    const orderValue = yield orders_1.default.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(data) } },
        { $lookup: { from: "qq_taxi_users", localField: "userId", foreignField: "chatId", as: "users" } },
        { $addFields: { user: { $arrayElemAt: ["$users", 0] } } },
        { $project: { users: 0 } }
    ]);
    if (!orderValue.length || (orderValue.length && !((_a = orderValue[0]) === null || _a === void 0 ? void 0 : _a.user))) {
        yield ctx.answerCbQuery("Buyurtmaga tegishli ma'lumotlar bilan muammo yuzaga keldi iltimos birozdan so'ng urinib ko'ring", { show_alert: true });
        return;
    }
    const order = orderValue[0];
    if (!order) {
        yield ctx.answerCbQuery("Buyurtma ma'lumotlari bilan muammo yuzaga keldi", { show_alert: true });
        return;
    }
    const driver = yield drivers_1.default.aggregate([
        { $match: { chatId: ctx.from.id } },
        { $lookup: { from: "qq_taxi_users", localField: "chatId", foreignField: "chatId", as: "users" } },
        { $addFields: { user: { $arrayElemAt: ["$users", 0] } } },
        { $project: { users: 0 } }
    ]);
    if (!driver.length || (driver.length && !((_b = driver[0]) === null || _b === void 0 ? void 0 : _b.user))) {
        yield ctx.answerCbQuery("Siz haydovchi emassiz!", { show_alert: true });
        return;
    }
    yield ctx.editMessageReplyMarkup({ inline_keyboard: [[{ text: "Buyurtmachi profili", url: `https://t.me/${order.user.phone}` }]] });
    yield ctx.telegram.sendMessage(order.userId, `<b>---🟡 Haydovchi Sizni kutmoqda ---</b>\n\n<b>Ismi:</b> ${driver[0].user.name}\n<b>Telefon:</b> ${driver[0].user.phone}\n<b>Mashina rusumi:</b> ${driver[0].carModel}\n<b>Mashina raqami:</b> ${driver[0].carNumber}`, {
        parse_mode: "HTML"
    });
});
const waiting = ctx => (0, functions_1.default)(ctx, handler);
exports.default = waiting;
