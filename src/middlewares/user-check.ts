import USERS from "../schemas/users";

const userCheck = async(ctx: any, next: Function) =>{
    const user = await USERS.findOne({chatId: ctx.from.id});
    if(user && user.status === "blocked"){
        const text = "Afsuski, siz qora ro'yxatga tushdingiz 😔. Qora ro'yxatdan chiqish uchun ushbu adminga yozing @DeveloperAbdurahmon"
        if(ctx?.update?.callback_query?.data){
            await ctx.answerCbQuery(text,{show_alert:true});
            return
        }
        await ctx.reply(text)
        return
    }
    next();
}

export default userCheck;