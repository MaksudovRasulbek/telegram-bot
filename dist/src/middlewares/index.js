"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rateLimit_1 = __importDefault(require("./rateLimit"));
const allMiddlewares = (bot) => {
    bot.use(rateLimit_1.default);
};
exports.default = allMiddlewares;
