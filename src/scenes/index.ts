import { Scenes, Telegraf } from "telegraf";
import addAdminScene from "./admin/add-admin";
import editBalanceScene from "./admin/edit-driver-balance";
import userBlockScene from "./admin/user-block";
import beDriverScene from "./driver/be-driver";
import beRegionalDriverScene from "./driver/be-regional-driver";
import editDriverScene from "./driver/edit-driver";
import selectDriverTypeScene from "./driver/select-driver-type";
import verifyDriverScene from "./driver/verify-driver";
import addOrderScene from "./order/add-order";
import addRegionalOrderScene from "./order/add-regional-order";
import editOrderScene from "./order/edit-order";
import editOrderPriceScene from "./order/edit-order-price";
import editRegionalOrderScene from "./order/edit-regional-order";
import editRegionalOrderPriceScene from "./order/edit-regional-order-price";


const stage = new Scenes.Stage();

const allScenes = (bot: Telegraf) =>{
    // bot.use((ctx: BotCtx,next: Function) =>{
    //     const activeScene = ctx.session?.__scenes?.current;
    //     if(activeScene){
    //         const data = ctx?.update?.callback_query?.data;
    //         if(data){
    //             console.log(data);                
    //         }
    //     }
    //     next();
    // });

    //admin scene
    stage.register(addAdminScene);
    stage.register(editBalanceScene);
    stage.register(userBlockScene);
    //drivers scene
    stage.register(selectDriverTypeScene);

    stage.register(beDriverScene);
    stage.register(verifyDriverScene);
    stage.register(editDriverScene);

    stage.register(beRegionalDriverScene)
    //order scenes
    stage.register(addOrderScene);
    stage.register(editOrderScene);
    stage.register(editOrderPriceScene);

    // regional order 
    stage.register(addRegionalOrderScene);
    stage.register(editRegionalOrderScene);
    stage.register(editRegionalOrderPriceScene);

    bot.use(stage.middleware());
}

export default allScenes;