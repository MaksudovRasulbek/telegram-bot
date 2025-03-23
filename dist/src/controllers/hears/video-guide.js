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
const functions_1 = __importDefault(require("../../utils/functions"));
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.telegram.sendAnimation(ctx.from.id, "https://t.me/bottekshiruv/9526", {
        caption: constants_1.KEYBOARDS.callTaxi
    });
    yield ctx.telegram.sendAnimation(ctx.from.id, "https://t.me/bottekshiruv/9527", {
        caption: constants_1.KEYBOARDS.toBeTaxi
    });
});
const videoGuide = ctx => (0, functions_1.default)(ctx, handler);
exports.default = videoGuide;
