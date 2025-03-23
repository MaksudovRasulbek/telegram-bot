"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const functions_1 = __importDefault(require("../../utils/functions"));
const handler = (ctx) => {
    ctx.scene.enter(scene_names_1.default.addAdmin);
};
const addAdmin = ctx => (0, functions_1.default)(ctx, handler);
exports.default = addAdmin;
