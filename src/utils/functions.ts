import { InlineKeyboardButton, KeyboardButton } from "telegraf/typings/core/types/typegram";
import { KEYBOARDS } from "../constants";
import REGIONS from "../constants/regions";
import { startKeyboard, startText } from "../controllers/commands/start";
import { BotCtx } from "../types/context";
import { IRegionalOrder } from "../types/orders";

/**
 * Bu funktsiya xatolarni ushlab olish va foydalanuvchiga tushunarli qilib javob berish uchun mo'ljallangan.
 * 
 * @param {BotCtx} ctx - Telegram bot konteksti (foydalanuvchi ma'lumotlari va boshqalar)
 * @param {Function} handler - asosiy ishlovchi funktsiya
 * 
 * Agar ishlov berish jarayonida xatolik yuzaga kelsa, u ushlanib, quyidagicha ishlanadi:
 *  - Xatolik konsolga yoziladi
 *  - Foydalanuvchiga "Sizda xatolik chiqdi" degan xabar yuboriladi
 *  - Xatolik matni foydalanuvchiga tushunarli qilib ko'rsatiladi (String(e) funktsiyasi yordamida)
 */

const handlerProvider = async(ctx: BotCtx, handler: Function) =>{
    try{
        const currentScene = ctx.session?.__scenes?.current;
        if(currentScene){
            const text = ctx?.message?.text;
            if(text){
                if(text === KEYBOARDS.mainMenu || text === "/start"){
                    sceneLeave(ctx, true, true)
                    return
                }
                if(text === KEYBOARDS.cancel){
                    await replyWithBoldText(ctx, "Yaxshi, bekor qilindi.", null, true);
                    await sceneLeave(ctx, true, true)
                    return
                }
            }
        }
        handler(ctx);
    }catch(e){
        console.log(e);
        ctx.reply(`Sizda xatolik chiqdi\n\nXatolik matni : ${String(e)}`);
        const currentScene = ctx.session?.__scenes?.current;
        if(currentScene){
            sceneLeave(ctx, true, true);
        }
    }
}

export default handlerProvider

export const replyWithBoldText = (ctx:BotCtx,txt: string,keyboards?: KeyboardButton[][], remove?: true) => ctx.reply(txt,{
    parse_mode:"HTML",
    reply_markup:{
        keyboard:keyboards || [],
        resize_keyboard: true,
        remove_keyboard: remove
    }});

export const replyWithInlineKeyboard = (ctx: BotCtx, txt: string, keyboards?: InlineKeyboardButton[][], remove?: true) =>ctx.reply(txt,{
    parse_mode:"HTML",
    reply_markup:{
        inline_keyboard:keyboards || [],
        remove_keyboard: remove
    }
})

export const chunkArray = (arr: any[],  columnSize: number) =>{
        const result = [];
        for(let i =0; i<arr.length;i+=columnSize){
            const items = arr.slice(i, i+ columnSize);
            result.push(items)
        }
        return result
    }

export const deleteMessage = (ctx: BotCtx) =>{
    try{
        ctx.deleteMessage().catch((e) =>e);
    }catch(e){
        console.log(`Xabarni o'chirishdagi xato: ${e}`);
    }
}

export const sceneLeave = async(ctx: BotCtx, removeSession?: boolean, start?: boolean) =>{
   await ctx.scene.leave();
    if(removeSession){
        ctx.session = {};
    }
    if(start){
        const keyboard = await startKeyboard(ctx);
        replyWithBoldText(ctx, startText, keyboard);
    }
}

export const getPercent = (number: number, percent: number) => (number * percent) / 100;


export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const regionalOrderInfo = (order: IRegionalOrder) : string|null =>{
    try{
        const from = REGIONS.find(r => r.id === order.fromRegionId);
         const to = REGIONS.find(r => r.id === order.toRegionId);
    if(from && to){
        return `Qayerdan: ${from.text} (${order.from})\nQayerga: ${to.text} (${order.to})\nNarxi: ${order.summa}`
    }else{
        return null
    }
    }catch{
        return null
    }
}