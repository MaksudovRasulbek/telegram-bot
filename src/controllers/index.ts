import { Telegraf } from "telegraf";
import allCommands from "./commands";
import allActions from "./actions";
import allHears from "./hears";


const allControllers = (bot: Telegraf) =>{
    allCommands(bot);
    allActions(bot);
    allHears(bot);
}

export default allControllers