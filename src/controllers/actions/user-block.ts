import { ENV } from "../../constants";
import USERS from "../../schemas/users";
import { BotCtx } from "../../types/context";
import handlerProvider from "../../utils/functions";


const handler = async(ctx: BotCtx) =>{
    const data = ctx.update.callback_query.data.split("_");
   const type = data[0];
   const userId = parseInt(data[2]);
   if(userId === ENV.adminId){
    await ctx.answerCbQuery("Adminnni bloklay olmaysiz",{show_alert:true});
    return
   }
    const user = await USERS.findOne({chatId: userId});
    if(!user){
        await ctx.answerCbQuery("Foydalanuvchi bazada mavjud emas",{show_alert: true});
        return
    }
    user.status = type === "block" ? "blocked" : "user";
    await user.save();
    await ctx.answerCbQuery(`Yaxshi ${user.name} ${type === "block" ? "bloklandi":"blokdan chiqarildi"}`, {show_alert: true});
    await ctx.editMessageReplyMarkup({
        inline_keyboard:[
            [
                {text: user.status === "blocked" ? "Blokdan chiqarish" :"Bloklash", callback_data: user.status === "blocked" ? `unblock_user_${user.chatId}` :`block_user_${user.chatId}` },
                {text:"Foydalanuvchi profili",url:`t.me/${user.phone}`}
            ]
        ]
    })
}

const userBlock = ctx => handlerProvider(ctx, handler);
export default userBlock