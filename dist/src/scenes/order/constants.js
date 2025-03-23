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
exports.regionalOrderLocationButtons = exports.orderLocationButtons = exports.submitOrderButtons = exports.editOrderButtons = exports.requestContact = void 0;
const constants_1 = require("../../constants");
const orders_1 = __importDefault(require("../../schemas/orders"));
const regional_orders_1 = __importDefault(require("../../schemas/regional-orders"));
const functions_1 = require("../../utils/functions");
exports.requestContact = [[{ text: constants_1.KEYBOARDS.yourPhoneNumber, request_contact: true }]];
exports.editOrderButtons = [
    { key: "from", text: constants_1.KEYBOARDS.from },
    { key: "to", text: constants_1.KEYBOARDS.to },
    { key: "price", text: constants_1.KEYBOARDS.price },
    { key: "phoneNumber", text: constants_1.KEYBOARDS.phoneNumber },
];
exports.submitOrderButtons = [
    [{ text: constants_1.KEYBOARDS.addOrder }],
    [{ text: constants_1.KEYBOARDS.editOrder }],
    [{ text: constants_1.KEYBOARDS.cancel }],
];
const orderLocationButtons = (ctx, districtId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch orders sorted by the most recent first
        const orders = yield orders_1.default.find({ userId: ctx.from.id, districtId: districtId }).sort({ _id: -1 });
        const buttonsData = [];
        // Collect order.from and order.to values
        for (let order of orders) {
            if (buttonsData.length >= 3)
                break;
            if (!buttonsData.find(b => b.text === order.from)) {
                buttonsData.push({ text: order.from });
            }
            if (buttonsData.length >= 3)
                break;
            if (!buttonsData.find(b => b.text === order.to)) {
                buttonsData.push({ text: order.to });
            }
        }
        // Chunk the array into single button arrays
        const result = (0, functions_1.chunkArray)(buttonsData, 1);
        return result.length ? result : null;
    }
    catch (_a) {
        return null;
    }
});
exports.orderLocationButtons = orderLocationButtons;
const regionalOrderLocationButtons = (ctx, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let findOption = {
            userId: ctx.from.id,
            $or: [
                { fromRegionId: id },
                { toRegionId: id }
            ]
        };
        const orders = yield regional_orders_1.default.find(findOption).sort({ _id: -1 });
        const buttonsData = [];
        for (let order of orders) {
            if (buttonsData.length >= 3)
                break;
            if (order.fromRegionId === id) {
                if (!buttonsData.find(b => b.text === order.from)) {
                    buttonsData.push({ text: order.from });
                }
            }
            if (order.toRegionId === id) {
                if (!buttonsData.find(b => b.text === order.to)) {
                    buttonsData.push({ text: order.to });
                }
            }
        }
        const result = (0, functions_1.chunkArray)(buttonsData, 1);
        return result.length ? result : null;
    }
    catch (_b) {
        return null;
    }
});
exports.regionalOrderLocationButtons = regionalOrderLocationButtons;
