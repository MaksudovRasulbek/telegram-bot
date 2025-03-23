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
const constants_1 = require("../../constants");
const orders_1 = __importDefault(require("../../schemas/orders"));
const functions_1 = __importDefault(require("../../utils/functions"));
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const data = ctx.update.callback_query.data.split("_")[2];
    const findOrder = yield orders_1.default.findOne({ _id: data });
    if (!findOrder) {
        yield ctx.answerCbQuery("Buyurtma bazadan topilmadi :(", { show_alert: true });
        return;
    }
    if (findOrder.status === "pending") {
        yield orders_1.default.findOneAndDelete({ _id: findOrder._id });
        yield ctx.telegram.editMessageText(ctx.from.id, ctx.update.callback_query.message.message_id, "", `---🟢 BUYURTMA BEKOR QILINDI---\n\n${ctx.from.first_name} : buyurtmangiz bekor qilindi.\n\nQishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`);
        const findDistrict = constants_1.DISTRICTS.find(d => d.id == findOrder.districtId);
        if (findDistrict) {
            yield ctx.telegram.editMessageText(findDistrict.chatId, findOrder.messageId, "", `---🛑 BEKOR QILINDI ---\n\nQayerdan: ${findOrder.from}\nQayerga: ${findOrder.to}\nNarxi: ${findOrder.summa}`);
        }
    }
    else {
        yield ctx.answerCbQuery("Buyurtmani bekor qilib bo'lmaydi :(", { show_alert: true });
    }
});
const cancelOrder = ctx => (0, functions_1.default)(ctx, handler);
exports.default = cancelOrder;
