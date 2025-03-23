"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = __importDefault(require("./commands"));
const actions_1 = __importDefault(require("./actions"));
const hears_1 = __importDefault(require("./hears"));
const allControllers = (bot) => {
    (0, commands_1.default)(bot);
    (0, actions_1.default)(bot);
    (0, hears_1.default)(bot);
};
exports.default = allControllers;
