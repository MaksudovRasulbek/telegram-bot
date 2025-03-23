"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_ratelimit_1 = __importDefault(require("telegraf-ratelimit"));
const rateLimitConfig = {
    window: 200,
    limit: 1,
    onLimitExceeded: () => {
        return;
    }
};
const limitMiddleware = (0, telegraf_ratelimit_1.default)(rateLimitConfig);
exports.default = limitMiddleware;
