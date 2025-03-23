import { ENV } from "../constants";

const checkAdmin = async(ctx: any, next: Function) =>{
    if(ctx.from.id !== ENV.adminId){
        if(ctx?.update?.callback_query?.data){
            await ctx.answerCbQuery("Siz admin emassiz",{show_alert: true});
            return
        }
        ctx.reply("Siz admin emassiz");
        return
    }
    next();
}

export default checkAdmin;