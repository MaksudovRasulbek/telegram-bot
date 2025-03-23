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
const regions_1 = __importDefault(require("../../constants/regions"));
const regional_orders_1 = __importDefault(require("../../schemas/regional-orders"));
const functions_1 = __importStar(require("../../utils/functions"));
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const data = ctx.update.callback_query.data.split("_")[3];
    const findOrder = yield regional_orders_1.default.findOne({ _id: data });
    if (!findOrder) {
        yield ctx.answerCbQuery("Buyurtma bazadan topilmadi :(", { show_alert: true });
        return;
    }
    if (findOrder.status === "pending") {
        yield regional_orders_1.default.findOneAndDelete({ _id: findOrder._id });
        yield ctx.telegram.editMessageText(ctx.from.id, ctx.update.callback_query.message.message_id, "", `---🟢 BUYURTMA BEKOR QILINDI---\n\n${ctx.from.first_name} : buyurtmangiz bekor qilindi.\n\nQishloq taksi xizmatidan foydalanganingiz uchun tashakkur!`);
        const findDistrict = regions_1.default.find(d => d.id == findOrder.fromRegionId);
        if (findDistrict) {
            const infoText = (0, functions_1.regionalOrderInfo)(findOrder);
            yield ctx.telegram.editMessageText(findDistrict.chatId, findOrder.messageId, "", `---🛑 BEKOR QILINDI ---\n\n${infoText}`);
        }
    }
    else {
        yield ctx.answerCbQuery("Buyurtmani bekor qilib bo'lmaydi :(", { show_alert: true });
    }
});
const cancelRegionalOrder = ctx => (0, functions_1.default)(ctx, handler);
exports.default = cancelRegionalOrder;
