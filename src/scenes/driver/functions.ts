import { actions } from "../../controllers/actions";
import { startKeyboard } from "../../controllers/commands/start";
import DRIVERS from "../../schemas/drivers";
import USERS from "../../schemas/users";
import { BotCtx } from "../../types/context";
import { replyWithBoldText, replyWithInlineKeyboard, sceneLeave } from "../../utils/functions";
import { TRUCKS } from "./constants";

export const checkAvailableCarModel = (ctx: BotCtx, text: string): boolean =>{
    const str = text.toLowerCase().split(" ")
    for(let i of str){
        if(TRUCKS.includes(i)){
            replyWithBoldText(ctx, "Bunday turdagi mashinalar bilan botimizda haydovchi sifatida ro'yhatdan o'ta olmaysiz", null, true);
            return false
        }
    }
    return true
}

export const checkSessionValueMiddleware = async(ctx: BotCtx, next: Function) =>{
    if(ctx?.update?.callback_query?.data){
        const callbackData = ctx.update.callback_query.data;
        
        // Check if callbackData matches any regex in actions
        for (const action of actions) {
            if (action.regex.test(callbackData)) {
                await action.handler(ctx);
                return; // Stop further execution
            }
        }
        ctx.answerCbQuery("Jarayonni tugatmasdan turib, inline tugmalarni ishlata olmaysiz :(",{show_alert: true});
       return
   }
   if(!ctx.session?.beDriverValue || !ctx.session?.editDriverKey){
    const keyboard = await startKeyboard(ctx);
    replyWithBoldText(ctx, "Ma'lumotlar bilan muammo chiqdi, iltimos keyinroq urinib ko'ring",keyboard);
    sceneLeave(ctx, true, false);
    return
   }
   await next();
}

export const createDriver = async(ctx: BotCtx) =>{
    const value = ctx.session.beDriverValue
    const user = await USERS.findOne({chatId: ctx.from.id});
    if(!user){
        const newUser = new USERS({
            name: value.name,
            phone: value.phone,
            chatId: ctx.from.id,
            status: "user",
            city: value.district.id
        });
        await newUser.save();
    }else{
        await USERS.findOneAndUpdate({chatId: ctx.from.id},{name: value.name, phone:value.phone, city: value.district.id});
    }

    const driver = await DRIVERS.findOne({chatId: ctx.from.id});
    let driverData: any = {chatId: ctx.from.id};
    if(value?.carModel){
        driverData.carModel = value.carModel
    }
    if(value?.carNumber){
        driverData.carNumber = value.carNumber
    }
    if(value?.district?.id){
        driverData.districtId = value.district.id
    }
    
    if(!driver){
        const newDriver = new DRIVERS({
            balance:0,
            ...driverData
        });
        await newDriver.save();
    }else{
        await DRIVERS.findOneAndUpdate({chatId: ctx.from.id},driverData)
    }

        // Soat, minut va sekundlarni olish
        const currentDate = new Date();
		const hours = currentDate.getHours();
		const minutes = currentDate.getMinutes();
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1; // Oylar 0 dan 11 gacha sonlar orqali sanalgan, shuning uchun 1 qo'shib chiqamiz
		const day = currentDate.getDate();
		const text = `
<b>SHARTNOMA </b> <code>№ ${ctx.from?.id}</code>


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
<b>Vaqt:</b> ${hours+5}:${minutes}  ${day < 10 ? "0" + day : day}-${
			month < 10 ? "0" + month : month
		}-${year}

Buyurtmalar qabul qilishni <b>boshlash uchun</b>
- pastdagi guruhga qo'shiling ⬇️`;

await replyWithInlineKeyboard(ctx, text, [
    [{text:"Guruhga qo'shilish", url:ctx.session.beDriverValue.district.url}]
 ]);
 const keyboard = await startKeyboard(ctx);
 await replyWithBoldText(ctx, "🚕", keyboard);
 await sceneLeave(ctx, true, false);
}