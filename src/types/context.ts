import { Context, Scenes } from "telegraf";
import { CallbackQuery, Message, Update } from "telegraf/typings/core/types/typegram";
import { IDistrict } from "./districts";
import { IRegion } from "./regions";
import { IUser } from "./users";

type callTaxiValue = {
    district : IDistrict,
    from?: string,
    to?: string,
    price?: number,
    phone?: string
}


type callRegionalTaxiValue = {
    fromRegion: IRegion,
    toRegion?: IRegion,
    price?: number,
    from?: string,
    to?: string,
    phone?: string
}

export type beDriverValue = {
    district: IDistrict,
    name?: string,
    phone?: string,
    carModel?: string,
    carNumber?: string,
    type?: "in" | "regional"
}

type editOrder = {
    key: string
}

type userBlock = "block" | "unblock"


interface sessionData extends Scenes.WizardSession{
    user?: IUser;
    callTaxi?: callTaxiValue,
    callRegionalTaxi?: callRegionalTaxiValue,
    editOrder?: editOrder,
    editRegionalOrderKey?: string,
    orderIdForEditPrice?: string ,
    regionalOrderIdForEditPrice?: string ,
    beDriverValue?: beDriverValue,
    editDriverKey?: string,
    driverChatIdForEditBalance?: number,
    userBlock?: userBlock
}

export interface BotCtx extends Context{
    session: sessionData,
    scene: Scenes.SceneContextScene<BotCtx, Scenes.WizardSessionData>,
    wizard: Scenes.WizardContextWizard<BotCtx>,
    message: Update.New
    & Update.NonChannel
    & Message
    & Message.TextMessage 
    & Message.AudioMessage
    & Message.VideoMessage
    & Message.ContactMessage;

    update: Update.CallbackQueryUpdate<CallbackQuery.DataQuery>
}