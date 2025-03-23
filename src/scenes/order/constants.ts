import { KeyboardButton } from "telegraf/typings/core/types/typegram";
import { KEYBOARDS } from "../../constants";
import ORDERS from "../../schemas/orders";
import REGIONALORDERS from "../../schemas/regional-orders";
import { BotCtx } from "../../types/context";
import { chunkArray } from "../../utils/functions";

export const requestContact = [[{text:KEYBOARDS.yourPhoneNumber, request_contact: true}]];

export const editOrderButtons = [
    {key:"from", text:KEYBOARDS.from},
    {key:"to", text:KEYBOARDS.to},
    {key:"price", text:KEYBOARDS.price},
    {key:"phoneNumber", text:KEYBOARDS.phoneNumber},
];

export const submitOrderButtons = [
    [{text:KEYBOARDS.addOrder}],
    [{text:KEYBOARDS.editOrder}],
    [{text:KEYBOARDS.cancel}],
]

export const orderLocationButtons = async (ctx: BotCtx, districtId: number): Promise<KeyboardButton[][] | null> => {
    try {
        // Fetch orders sorted by the most recent first
        const orders = await ORDERS.find({ userId: ctx.from.id, districtId: districtId }).sort({ _id: -1 });
        const buttonsData: { text: string }[] = [];

        // Collect order.from and order.to values
        for (let order of orders) {
            if (buttonsData.length >= 3) break;
            if (!buttonsData.find(b => b.text === order.from)) {
                buttonsData.push({ text: order.from });
            }
            if (buttonsData.length >= 3) break;
            if (!buttonsData.find(b => b.text === order.to)) {
                buttonsData.push({ text: order.to });
            }
        }

        // Chunk the array into single button arrays
        const result = chunkArray(buttonsData, 1);
        return result.length ? result : null;
    } catch {
        return null;
    }
}

export const regionalOrderLocationButtons = async (ctx: BotCtx, id: number): Promise<KeyboardButton[][] | null> => {
    try {
        let findOption: any = {
            userId: ctx.from.id,
            $or: [
                { fromRegionId: id },
                { toRegionId: id }
            ]
        }
        
        const orders = await REGIONALORDERS.find(findOption).sort({ _id: -1 });
        const buttonsData: { text: string }[] = [];
        
        for (let order of orders) {
            if (buttonsData.length >= 3) break;
            if(order.fromRegionId === id){
                if (!buttonsData.find(b => b.text === order.from)) {
                    buttonsData.push({ text: order.from });
                }
            }

            if(order.toRegionId === id){
                if (!buttonsData.find(b => b.text === order.to)) {
                    buttonsData.push({ text: order.to });
                }
            }
        }

        const result = chunkArray(buttonsData, 1);
        return result.length ? result : null;
    } catch {
        return null;
    }
}