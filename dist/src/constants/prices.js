"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regioanPriceButtons = exports.REGIONALPRICES = exports.priceButtons = void 0;
const functions_1 = require("../utils/functions");
const PRICES = [5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 20000, 25000, 30000, 35000];
const priceButtons = () => {
    try {
        const nums = PRICES.map(n => { return { text: n }; });
        const keyboards = (0, functions_1.chunkArray)(nums, 3);
        return keyboards;
    }
    catch (_a) {
        return [];
    }
};
exports.priceButtons = priceButtons;
exports.default = PRICES;
exports.REGIONALPRICES = [80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 200000, 250000, 280000, 300000];
const regioanPriceButtons = () => {
    try {
        const nums = exports.REGIONALPRICES.map(n => { return { text: n }; });
        const keyboards = (0, functions_1.chunkArray)(nums, 3);
        return keyboards;
    }
    catch (_a) {
        return [];
    }
};
exports.regioanPriceButtons = regioanPriceButtons;
