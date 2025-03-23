"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionButtons = void 0;
const functions_1 = require("../utils/functions");
// const REGIONS :IRegion[] = [
//     {id:500, text:"Toshkent", chatId:-1001391780001, url:"https://t.me/+aRAEKZdeIhszMmIy"},
//     {id:501, text:"Buxoro", chatId:-1001391780001, url:"https://t.me/+9ZYPdxhqY6Q0Zjli"},
// ];
const REGIONS = [
    { id: 500, text: "Toshkent", chatId: -1002199268527, url: "https://t.me/+aRAEKZdeIhszMmIy" },
    { id: 501, text: "Buxoro", chatId: -1002154815689, url: "https://t.me/+9ZYPdxhqY6Q0Zjli" },
];
const regionButtons = (id) => {
    try {
        const data = id ? REGIONS.filter(r => r.id !== id) : REGIONS;
        const buttons = data.map((d) => {
            return { text: d.text };
        });
        const keyboards = (0, functions_1.chunkArray)(buttons, 1);
        return keyboards !== null && keyboards !== void 0 ? keyboards : [];
    }
    catch (_a) {
        return [];
    }
};
exports.regionButtons = regionButtons;
exports.default = REGIONS;
