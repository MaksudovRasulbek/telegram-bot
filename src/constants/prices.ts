import { KeyboardButton } from "telegraf/typings/core/types/typegram";
import { chunkArray } from "../utils/functions";

const PRICES = [5000,6000,7000,8000,9000,10000,11000,12000,13000,14000,15000,20000,25000,30000,35000];

export const priceButtons = () : KeyboardButton[][] =>{
    try{
        const nums = PRICES.map(n => {return {text: n}});
        const keyboards = chunkArray(nums, 3);
        return keyboards
    }catch{
        return []
    }
}
export default PRICES

export const REGIONALPRICES = [80000, 90000, 100000,110000,120000,130000,140000,150000,200000,250000,280000,300000];

export const regioanPriceButtons = () : KeyboardButton[][] =>{
    try{
        const nums = REGIONALPRICES.map(n => {return {text: n}});
        const keyboards = chunkArray(nums, 3);
        return keyboards
    }catch{
        return []
    }
}
