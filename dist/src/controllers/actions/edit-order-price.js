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
const scene_names_1 = __importDefault(require("../../constants/scene-names"));
const orders_1 = __importDefault(require("../../schemas/orders"));
const users_1 = __importDefault(require("../../schemas/users"));
const functions_1 = __importDefault(require("../../utils/functions"));
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const data = ctx.update.callback_query.data.split("_")[2];
    const findOrder = yield orders_1.default.findOne({ _id: data });
    if (!findOrder) {
        yield ctx.answerCbQuery("Buyurtma bazadan topilmadi :(", { show_alert: true });
        return;
    }
    if (findOrder.status === "pending") {
        const findDistrict = constants_1.DISTRICTS.find(d => d.id === findOrder.districtId);
        const user = yield users_1.default.findOne({ chatId: ctx.from.id });
        if (!findDistrict || !user) {
            yield ctx.answerCbQuery("Ma'lumotlar bilan muammo yuzaga keldi, keyinroq urinib ko'ring", { show_alert: true });
            return;
        }
        ctx.session.orderIdForEditPrice = String(findOrder._id);
        ctx.scene.enter(scene_names_1.default.editOrderPrice);
    }
    else {
        yield ctx.answerCbQuery("Buyurtmani allaqachon qabul qilingan", { show_alert: true });
    }
});
const editOrderPrice = ctx => (0, functions_1.default)(ctx, handler);
exports.default = editOrderPrice;
