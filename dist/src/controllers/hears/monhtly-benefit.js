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
const orders_1 = __importDefault(require("../../schemas/orders"));
const regional_orders_1 = __importDefault(require("../../schemas/regional-orders"));
const users_1 = __importDefault(require("../../schemas/users"));
const functions_1 = __importStar(require("../../utils/functions"));
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ chatId: ctx.from.id });
    const isAvailable = (ctx.from.id === constants_1.ENV.adminId || user && user.status === "admin");
    if (!isAvailable) {
        (0, functions_1.replyWithBoldText)(ctx, "Sizga ushbu statistikani ko'rish uchun ruhsat yo'q");
        return;
    }
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let fullYear = `${year}-${month < 10 ? '0' + month : month}-01`;
    const acceptedOrders = yield orders_1.default.find({ createdAt: { $gte: new Date(fullYear), $lte: new Date() }, status: "accepted" }).select("summa");
    const acceptedRegionalOrders = yield regional_orders_1.default.find({ createdAt: { $gte: new Date(fullYear), $lte: new Date() }, status: "accepted" }).select("summa");
    if (!acceptedOrders.length && !acceptedRegionalOrders.length) {
        (0, functions_1.replyWithBoldText)(ctx, "Hali buyurtmalar mavjud emas");
        return;
    }
    const totalOrdersSum = acceptedOrders.reduce((acc, order) => acc + order.summa, 0);
    const totalOrdersBenefit = acceptedOrders.reduce((acc, order) => acc + (0, functions_1.getPercent)(order.summa, order.summa >= 20000 ? constants_1.ENV.minPercent : constants_1.ENV.percent), 0);
    const totalRegionalOrdersSum = acceptedRegionalOrders.reduce((acc, order) => acc + order.summa, 0);
    const totalRegionalOrdersBenefit = acceptedRegionalOrders.reduce((acc, order) => acc + (0, functions_1.getPercent)(order.summa, constants_1.ENV.minPercent), 0);
    const totalSumma = Number(totalOrdersSum) + Number(totalRegionalOrdersSum);
    const totalBenefit = Number(totalOrdersBenefit) + Number(totalRegionalOrdersBenefit);
    const pendingOrders = yield orders_1.default.find({ createdAt: { $gte: new Date(fullYear), $lte: new Date() }, status: "pending" }).select("summa");
    const pendingRegionalOrders = yield regional_orders_1.default.find({ createdAt: { $gte: new Date(fullYear), $lte: new Date() }, status: "pending" }).select("summa");
    const pendingOrdersSum = pendingOrders.reduce((acc, order) => acc + order.summa, 0);
    const pendingOrdersBenefit = pendingOrders.reduce((acc, order) => acc + (0, functions_1.getPercent)(order.summa, order.summa >= 20000 ? constants_1.ENV.minPercent : constants_1.ENV.percent), 0);
    const pendingRegionalOrdersSum = pendingRegionalOrders.reduce((acc, order) => acc + order.summa, 0);
    const pendingRegionalOrdersBenefit = pendingRegionalOrders.reduce((acc, order) => acc + (0, functions_1.getPercent)(order.summa, constants_1.ENV.minPercent), 0);
    const pendingSumma = Number(pendingOrdersSum) + Number(pendingRegionalOrdersSum);
    const pendingBenefit = Number(pendingOrdersBenefit) + Number(pendingRegionalOrdersBenefit);
    (0, functions_1.replyWithBoldText)(ctx, `Ushbu oydagi daromad:\n\nJami buyurtmalar narxi: ${totalSumma}\nSof foyda : ${totalBenefit}\n\nKutilvotgan buyurtmalar narxi: ${pendingSumma}\nKutilvotgan sof foyda : ${pendingBenefit}`);
});
const monthlyBenefit = ctx => (0, functions_1.default)(ctx, handler);
exports.default = monthlyBenefit;
