"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editDriverButtons = exports.submitDriverButtons = exports.TRUCKS = void 0;
const constants_1 = require("../../constants");
exports.TRUCKS = ["damas", "kamaz", "fura", "labo", "moto"];
exports.submitDriverButtons = [
    [{ text: constants_1.KEYBOARDS.confirm }],
    [{ text: constants_1.KEYBOARDS.editOrder }],
    [{ text: constants_1.KEYBOARDS.cancel }],
];
exports.editDriverButtons = [
    { key: "name", text: constants_1.KEYBOARDS.name },
    { key: "phoneNumber", text: constants_1.KEYBOARDS.phoneNumber },
    { key: "carModel", text: constants_1.KEYBOARDS.carModel },
    { key: "carNumber", text: constants_1.KEYBOARDS.carNumber },
];
