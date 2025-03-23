import { Telegraf } from "telegraf";
import limitMiddleware from "./rateLimit";


const allMiddlewares = (bot:Telegraf) =>{
    bot.use(limitMiddleware);
}

export default allMiddlewares