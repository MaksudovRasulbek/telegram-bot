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
exports.createDriver = exports.checkSessionValueMiddleware = exports.checkAvailableCarModel = void 0;
const actions_1 = require("../../controllers/actions");
const start_1 = require("../../controllers/commands/start");
const drivers_1 = __importDefault(require("../../schemas/drivers"));
const users_1 = __importDefault(require("../../schemas/users"));
const functions_1 = require("../../utils/functions");
const constants_1 = require("./constants");
const checkAvailableCarModel = (ctx, text) => {
    const str = text.toLowerCase().split(" ");
    for (let i of str) {
        if (constants_1.TRUCKS.includes(i)) {
            (0, functions_1.replyWithBoldText)(ctx, "Bunday turdagi mashinalar bilan botimizda haydovchi sifatida ro'yhatdan o'ta olmaysiz", null, true);
            return false;
        }
    }
    return true;
};
exports.checkAvailableCarModel = checkAvailableCarModel;
const checkSessionValueMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if ((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.update) === null || _a === void 0 ? void 0 : _a.callback_query) === null || _b === void 0 ? void 0 : _b.data) {
        const callbackData = ctx.update.callback_query.data;
        // Check if callbackData matches any regex in actions
        for (const action of actions_1.actions) {
            if (action.regex.test(callbackData)) {
                yield action.handler(ctx);
                return; // Stop further execution
            }
        }
        ctx.answerCbQuery("Jarayonni tugatmasdan turib, inline tugmalarni ishlata olmaysiz :(", { show_alert: true });
        return;
    }
    if (!((_c = ctx.session) === null || _c === void 0 ? void 0 : _c.beDriverValue) || !((_d = ctx.session) === null || _d === void 0 ? void 0 : _d.editDriverKey)) {
        const keyboard = yield (0, start_1.startKeyboard)(ctx);
        (0, functions_1.replyWithBoldText)(ctx, "Ma'lumotlar bilan muammo chiqdi, iltimos keyinroq urinib ko'ring", keyboard);
        (0, functions_1.sceneLeave)(ctx, true, false);
        return;
    }
    yield next();
});
exports.checkSessionValueMiddleware = checkSessionValueMiddleware;
const createDriver = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const value = ctx.session.beDriverValue;
    const user = yield users_1.default.findOne({ chatId: ctx.from.id });
    if (!user) {
        const newUser = new users_1.default({
            name: value.name,
            phone: value.phone,
            chatId: ctx.from.id,
            status: "user",
            city: value.district.id
        });
        yield newUser.save();
    }
    else {
        yield users_1.default.findOneAndUpdate({ chatId: ctx.from.id }, { name: value.name, phone: value.phone, city: value.district.id });
    }
    const driver = yield drivers_1.default.findOne({ chatId: ctx.from.id });
    let driverData = { chatId: ctx.from.id };
    if (value === null || value === void 0 ? void 0 : value.carModel) {
        driverData.carModel = value.carModel;
    }
    if (value === null || value === void 0 ? void 0 : value.carNumber) {
        driverData.carNumber = value.carNumber;
    }
    if ((_e = value === null || value === void 0 ? void 0 : value.district) === null || _e === void 0 ? void 0 : _e.id) {
        driverData.districtId = value.district.id;
    }
    if (!driver) {
        const newDriver = new drivers_1.default(Object.assign({ balance: 0 }, driverData));
        yield newDriver.save();
    }
    else {
        yield drivers_1.default.findOneAndUpdate({ chatId: ctx.from.id }, driverData);
    }
    // Soat, minut va sekundlarni olish
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Oylar 0 dan 11 gacha sonlar orqali sanalgan, shuning uchun 1 qo'shib chiqamiz
    const day = currentDate.getDate();
    const text = `
<b>SHARTNOMA </b> <code>№ ${(_f = ctx.from) === null || _f === void 0 ? void 0 : _f.id}</code>


“Qishloq taksi” AJ va <b>${ctx.session.beDriverValue.name}</b> (hamkor hamkor)
o'rtasidagi shartnoma

<b>Buyurtmalar chatiga obuna bo'lish orqali</b>, siz quyidagi shart va shartlarga rozilik bildirasiz:
- Shaxsiy ma'lumotlarni qayta ishlash va saqlash uchun
- Siz olgan har bir buyurtma uchun ${value.type === "regional" ? "5%" : "10%"} komissiya
${value.type !== "regional" ? "- 20000 so'm dan ortiq buyurtmalar uchun 5% komissiya" : ""}

<b>Suhbatda ro'yxatdan o'tganingizdan so'ng</b>, darhol buyurtmalarni qabul qilishingiz mumkin:
- Balansingizda etarli <b>komissiya miqdori</b> bo'lishi kerak
- Balansni to'ldirish uchun asosiy menyudagi Balansni to'ldirish tugmasiga o'tishingiz kerak

Agar siz quyidagi talablarga javob bermasangiz, <b>shartnoma bir tomonlama bekor qilinadi:</b>
- Buyurtmani qabul qilgandan keyin mijozni yoniga kech tashrif buyurilganda
- Olingan buyurtmaga bormasangiz
- mijozdan buyurtmada ko'rsatilgan narxdan ortiq pul so'raganda
- Mijoz bilan qo'pol gapirilganda
- Mashinada 4 tadan ko'p odam yo’lovchi bo'lganda
- Agar siz boshqa haydovchi tomonidan qabul qilingan buyurtmaga borsangiz
- Agar mashinangizning ichki qismi iflos bo'lganda

Hamkor patentga ega bo'lishi kerak. Agar patenti bo'lmasa, javobgarlikni Hamkor haydovchi <b>o'z zimmasiga oladi.</b>

Hamkor kiritilgan ma'lumotlarning to'g'riligiga <b>kafolat beradi.</b>

<b>Diqqat qilish!</b> Buyurtmalar chatida ro'yxatdan o'tish orqali siz shartnomaga rozilik bildirasiz
<b>Vaqt:</b> ${hours + 5}:${minutes}  ${day < 10 ? "0" + day : day}-${month < 10 ? "0" + month : month}-${year}

Buyurtmalar qabul qilishni <b>boshlash uchun</b>
- pastdagi guruhga qo'shiling ⬇️`;
    yield (0, functions_1.replyWithInlineKeyboard)(ctx, text, [
        [{ text: "Guruhga qo'shilish", url: ctx.session.beDriverValue.district.url }]
    ]);
    const keyboard = yield (0, start_1.startKeyboard)(ctx);
    yield (0, functions_1.replyWithBoldText)(ctx, "🚕", keyboard);
    yield (0, functions_1.sceneLeave)(ctx, true, false);
});
exports.createDriver = createDriver;
