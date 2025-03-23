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
const telegraf_1 = require("telegraf");
const constants_1 = require("../../constants");
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const only_text_1 = __importDefault(require("../../middlewares/only-text"));
const functions_1 = __importStar(require("../../utils/functions"));
const enter = (ctx) => {
    (0, functions_1.replyWithBoldText)(ctx, "Tanlang", [
        [{ text: constants_1.KEYBOARDS.inRegion }],
        [{ text: constants_1.KEYBOARDS.accrosRegion }],
    ]);
    return ctx.wizard.next();
};
const checkCarNumber = (ctx) => {
    const text = ctx.message.text;
    if (text === constants_1.KEYBOARDS.inRegion) {
        return ctx.scene.enter(scene_names_1.default.beDriver);
    }
    if (text === constants_1.KEYBOARDS.accrosRegion) {
        return ctx.scene.enter(scene_names_1.default.beRegionalDriver);
    }
};
const selectDriverTypeScene = new telegraf_1.Scenes.WizardScene(scene_names_1.default.selectDriverType, (ctx) => __awaiter(void 0, void 0, void 0, function* () { (0, functions_1.default)(ctx, enter); }), (ctx) => __awaiter(void 0, void 0, void 0, function* () { yield (0, only_text_1.default)(ctx, () => (0, functions_1.default)(ctx, checkCarNumber)); }));
exports.default = selectDriverTypeScene;
