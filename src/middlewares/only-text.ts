import { actions } from "../controllers/actions";
import { BotCtx } from "../types/context";
import { deleteMessage } from "../utils/functions";



const onlyTextMiddleware = async (ctx: BotCtx, next: Function) => {
    if (ctx?.update?.callback_query?.data) {
        const callbackData = ctx.update.callback_query.data;
        
        // Check if callbackData matches any regex in actions
        for (const action of actions) {
            if (action.regex.test(callbackData)) {
                await action.handler(ctx);
                return; // Stop further execution
            }
        }

        ctx.answerCbQuery("Jarayonni tugatmasdan turib, inline tugmalarni ishlata olmaysiz :(", {show_alert: true});
        return;
    }

    const text = ctx?.message?.text;
    if (!text) {
        deleteMessage(ctx);
        return;
    }

    await next();
};

export default onlyTextMiddleware