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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const functions_1 = __importStar(require("../../utils/functions"));
const handler = (ctx) => {
    if (ctx.from.id != constants_1.ENV.adminId) {
        (0, functions_1.replyWithBoldText)(ctx, "Siz admin emassiz");
        return;
    }
    const text = ctx.message.text;
    const blockType = text === constants_1.KEYBOARDS.block ? "block" : text === constants_1.KEYBOARDS.unblock ? "unblock" : undefined;
    ctx.session.userBlock = blockType;
    ctx.scene.enter(scene_names_1.default.block);
};
const userBlock = ctx => (0, functions_1.default)(ctx, handler);
exports.default = userBlock;
