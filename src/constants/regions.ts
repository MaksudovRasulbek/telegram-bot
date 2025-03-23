import { KeyboardButton } from "telegraf/typings/core/types/typegram";
import { IRegion } from "../types/regions";
import { chunkArray } from "../utils/functions";


// const REGIONS :IRegion[] = [
//     {id:500, text:"Toshkent", chatId:-1001391780001, url:"https://t.me/+aRAEKZdeIhszMmIy"},
//     {id:501, text:"Buxoro", chatId:-1001391780001, url:"https://t.me/+9ZYPdxhqY6Q0Zjli"},
// ];

const REGIONS :IRegion[] = [
    {id:500, text:"Toshkent", chatId:-1002199268527, url:"https://t.me/+aRAEKZdeIhszMmIy"},
    {id:501, text:"Buxoro", chatId:-1002154815689, url:"https://t.me/+9ZYPdxhqY6Q0Zjli"},
];

export const regionButtons = (id?: number): KeyboardButton[][] =>{
    try{
        const data = id ? REGIONS.filter(r => r.id !== id) : REGIONS;
        const buttons = data.map((d) => {
            return {text:d.text}
        });
        const keyboards = chunkArray(buttons,1);
        return keyboards ?? []
    }catch{
        return []
    }
}

export default REGIONS