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
exports.checkPhoneNumber = exports.checkSum = exports.reSendRegionalOrder = exports.createRegionalOrder = exports.reSendOrder = exports.createOrder = void 0;
const constants_1 = require("../../constants");
const regions_1 = __importDefault(require("../../constants/regions"));
const start_1 = require("../../controllers/commands/start");
const orders_1 = __importDefault(require("../../schemas/orders"));
const regional_orders_1 = __importDefault(require("../../schemas/regional-orders"));
const users_1 = __importDefault(require("../../schemas/users"));
const functions_1 = require("../../utils/functions");
const constants_2 = require("./constants");
const createOrder = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const value = ctx.session.callTaxi;
    const user = yield users_1.default.findOne({ chatId: ctx.from.id });
    if (!user) {
        const newUser = new users_1.default({ name: ctx.from.first_name, chatId: ctx.from.id, phone: value.phone, status: "user", city: value.district.id });
        yield newUser.save();
    }
    if (user) {
        user.phone = value.phone;
        user.city = value.district.id;
        yield user.save();
    }
    const newOrder = new orders_1.default({
        districtId: value.district.id,
        status: "pending",
        userId: ctx.from.id,
        summa: value.price,
        from: value.from,
        to: value.to
    });
    const text = `---🔶 YANGI BUYURTMA---\n\nQayerdan: ${value.from}\nQayerga: ${value.to}\nNarxi: ${value.price}`;
    const groupMessage = yield ctx.telegram.sendMessage(value.district.chatId, text, {
        reply_markup: {
            inline_keyboard: [
                [{ text: constants_1.KEYBOARDS.accept, callback_data: `accept_order_${newOrder._id}` }]
            ]
        }
    });
    yield ctx.telegram.sendMessage(constants_1.ENV.channelId, `${text}\n\nFoydalanuvchi\n\nIsmi: ${(_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : ctx.from.first_name}\nRaqami: ${value.phone}\nTelegram id: ${ctx.from.id}`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: (user === null || user === void 0 ? void 0 : user.status) === "blocked" ? "Blokdan chiqarish" : "Bloklash", callback_data: (user === null || user === void 0 ? void 0 : user.status) === "blocked" ? `unblock_user_${ctx.from.id}` : `block_user_${ctx.from.id}` },
                    { text: "Foydalanuvchi profili", url: `t.me/${value.phone}` }
                ]
            ]
        }
    }).catch(() => { });
    newOrder.messageId = groupMessage.message_id;
    yield newOrder.save();
    yield (0, functions_1.replyWithInlineKeyboard)(ctx, `Javobni kuting\n\nBuyurtma ko'rib chiqilmoqda... \n\n- Haydovchi siz bilan bog'lanadi\n\n${ctx.from.first_name}, Qishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`, [[{ text: constants_1.KEYBOARDS.cancel, callback_data: `cancel_order_${newOrder._id}` }]]);
    yield (0, functions_1.sceneLeave)(ctx, true, false);
    const keyboard = yield (0, start_1.startKeyboard)(ctx);
    yield (0, functions_1.replyWithBoldText)(ctx, "🚕", keyboard);
    yield (0, exports.reSendOrder)(ctx, String(newOrder._id));
});
exports.createOrder = createOrder;
const reSendOrder = (ctx, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const time = 1000 * 60;
    yield (0, functions_1.sleep)(5 * time);
    const findOrder = yield orders_1.default.findById(orderId);
    if (findOrder && findOrder.status === "pending") {
        (0, functions_1.replyWithInlineKeyboard)(ctx, `---♻️ NARXNI O'ZGARTIRISH ---\n\nQayerdan: ${findOrder.from}\nQayerga: ${findOrder.to}\nNarxi: ${findOrder.summa}\n\nYo'l haqqi haydovchilarga ma'qul kelmayapti iltimos uni o'zgartiring.`, [[{ text: constants_1.KEYBOARDS.editPrice, callback_data: `edit_order_${orderId}` }, { text: constants_1.KEYBOARDS.cancel, callback_data: `cancel_order_${orderId}` }]]);
    }
});
exports.reSendOrder = reSendOrder;
const createRegionalOrder = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const value = ctx.session.callRegionalTaxi;
    const user = yield users_1.default.findOne({ chatId: ctx.from.id });
    if (!user) {
        const newUser = new users_1.default({ name: ctx.from.first_name, chatId: ctx.from.id, phone: value.phone, status: "user", city: value.fromRegion.id });
        yield newUser.save();
    }
    if (user) {
        user.phone = value.phone;
        user.city = value.fromRegion.id;
        yield user.save();
    }
    const newOrder = new regional_orders_1.default({
        fromRegionId: value.fromRegion.id,
        toRegionId: value.toRegion.id,
        status: "pending",
        userId: ctx.from.id,
        summa: value.price,
        from: value.from,
        to: value.to
    });
    const from = regions_1.default.find(r => r.id === newOrder.fromRegionId);
    const to = regions_1.default.find(r => r.id === newOrder.toRegionId);
    if (from && to) {
        const text = `---🔶 YANGI BUYURTMA---\n\nQayerdan: ${from.text} (${value.from})\nQayerga: ${to.text} (${value.to})\nNarxi: ${value.price}`;
        const groupMessage = yield ctx.telegram.sendMessage(from.chatId, text, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: constants_1.KEYBOARDS.accept, callback_data: `accept_regional_order_${newOrder._id}` }]
                ]
            }
        });
        yield ctx.telegram.sendMessage(constants_1.ENV.channelId, `${text}\n\nFoydalanuvchi\n\nIsmi: ${(_b = user === null || user === void 0 ? void 0 : user.name) !== null && _b !== void 0 ? _b : ctx.from.first_name}\nRaqami: ${value.phone}\nTelegram id: ${ctx.from.id}`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: (user === null || user === void 0 ? void 0 : user.status) === "blocked" ? "Blokdan chiqarish" : "Bloklash", callback_data: (user === null || user === void 0 ? void 0 : user.status) === "blocked" ? `unblock_user_${ctx.from.id}` : `block_user_${ctx.from.id}` },
                        { text: "Foydalanuvchi profili", url: `t.me/${value.phone}` }
                    ]
                ]
            }
        }).catch(() => { });
        newOrder.messageId = groupMessage.message_id;
        yield newOrder.save();
        yield (0, functions_1.replyWithInlineKeyboard)(ctx, `Javobni kuting\n\nBuyurtma ko'rib chiqilmoqda... \n\n- Haydovchi siz bilan bog'lanadi\n\n${ctx.from.first_name}, Qishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`, [[{ text: constants_1.KEYBOARDS.cancel, callback_data: `cancel_regional_order_${newOrder._id}` }]]);
        yield (0, functions_1.sceneLeave)(ctx, true, false);
        const keyboard = yield (0, start_1.startKeyboard)(ctx);
        yield (0, functions_1.replyWithBoldText)(ctx, "🚕", keyboard);
        yield (0, exports.reSendRegionalOrder)(ctx, String(newOrder._id));
    }
});
exports.createRegionalOrder = createRegionalOrder;
const reSendRegionalOrder = (ctx, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const time = 1000 * 60;
    yield (0, functions_1.sleep)(5 * time);
    const findOrder = yield regional_orders_1.default.findById(orderId);
    if (findOrder && findOrder.status === "pending") {
        const from = regions_1.default.find(r => r.id === findOrder.fromRegionId);
        const to = regions_1.default.find(r => r.id === findOrder.toRegionId);
        if (to && from) {
            (0, functions_1.replyWithInlineKeyboard)(ctx, `---♻️ NARXNI O'ZGARTIRISH ---\n\nQayerdan: ${from.text} (${findOrder.from})\nQayerga: ${to.text} (${findOrder.to})\nNarxi: ${findOrder.summa}\n\nYo'l haqqi haydovchilarga ma'qul kelmayapti iltimos uni o'zgartiring.`, [[{ text: constants_1.KEYBOARDS.editPrice, callback_data: `edit_regional_order_${orderId}` }, { text: constants_1.KEYBOARDS.cancel, callback_data: `cancel_regional_order_${orderId}` }]]);
        }
    }
});
exports.reSendRegionalOrder = reSendRegionalOrder;
const checkSum = (ctx, text) => {
    const sumRegex = new RegExp(/^[1-9]\d*$/);
    if (!sumRegex.test(text)) {
        (0, functions_1.replyWithBoldText)(ctx, "Iltimos narxni to'gri kiriting, so'z qo'shmasdan, orasini ochmasdan shunchaki raqamlar orqali. \n\nNamuna : 10000");
        return false;
    }
    if (Number(text) < 1000) {
        (0, functions_1.replyWithBoldText)(ctx, "Narx juda ham kam, sal qimmatroq narx belgilang:");
        return false;
    }
    if (Number(text) > 5000000) {
        (0, functions_1.replyWithBoldText)(ctx, "Narx juda ham baland, sal arzonroq narx belgilang:");
        return false;
    }
    return true;
};
exports.checkSum = checkSum;
const checkPhoneNumber = (ctx, text) => {
    const phoneRegex = new RegExp(/^\+998\d{9}$/);
    if (!phoneRegex.test(text.padStart(13, "+"))) {
        (0, functions_1.replyWithBoldText)(ctx, "Xato raqam, Iltimos raqamingizni to'gri (+998xxxxxxxxx formatda) kiriting yoki pastdagi tugma orqali yuboring.", constants_2.requestContact);
        return false;
    }
    return true;
};
exports.checkPhoneNumber = checkPhoneNumber;
