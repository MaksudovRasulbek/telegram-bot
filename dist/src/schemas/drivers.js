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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// user schema
// status userni kim ekanligini bilish uchun ya'ni oddiy usermi yoki adminstrator, agarda bloklansa "blocked" statusini oladi va botni ishlata olmaydi
const driverSchema = new mongoose_1.Schema({
    carModel: { type: String, required: true },
    carNumber: { type: String, required: true },
    chatId: { type: Number, required: true },
    balance: { type: Number, default: 0 },
    districtId: { type: Number, required: true },
    status: { type: String, default: "pending" },
}, {
    timestamps: true
});
const DRIVERS = mongoose_1.default.model("qq_taxi_drivers", driverSchema);
exports.default = DRIVERS;
