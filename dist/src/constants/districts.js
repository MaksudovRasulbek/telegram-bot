"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.districtButtons = void 0;
const functions_1 = require("../utils/functions");
// const DISTRICTS : IDistrict[] = [
//     {id:1, url:"https://t.me/+Z3DlAzweTlIwYTIy", chatId:-1001391780001, text:"Buxoro shahri"},
//     {id:2, url:"https://t.me/+hNGXmVzZQCU4YzMy", chatId:-1001391780001, text:"Kogon shahri"},
//     {id:3, url:"https://t.me/+vsTKe6mkZMlkMTUy", chatId:-1001391780001, text:"Buxoro tumani"},
//     {id:4, url:"https://t.me/+Q7aZkyB_c944OTJi", chatId:-1001391780001, text:"Vobkent tumani"},
//     {id:5, url:"https://t.me/+_kWVduBI4wljOWZi", chatId:-1001391780001, text:"Jondor tumani"},
//     {id:6, url:"https://t.me/+kCv4xLn0_rE0N2E6", chatId:-1001391780001, text:"Kogon tumani"},
//     {id:7, url:"https://t.me/+NSqrxi4WaJlhNjQy", chatId:-1001391780001, text:"Olot tumani"},
//     {id:8, url:"https://t.me/+ULgiocXglZxjMzhi", chatId:-1001391780001, text:"Peshku tumani"},
//     {id:9, url:"https://t.me/+7up_grmhvKYzMjBi", chatId:-1001391780001, text:"Romitan tumani"},
//     {id:10, url:"https://t.me/+yt6NVblUAiFjN2Ey", chatId:-1001391780001, text:"Shofirkon tumani"},
//     {id:11, url:"https://t.me/+6dBQk2PuzZBlNjM6", chatId:-1001391780001, text:"Qorako'l tumani"},
//     {id:12, url:"https://t.me/+7oCjG2J9aP9lNWNi", chatId:-1001391780001, text:"G'ijduvon tumani"},
//     {id:13, url:"https://t.me/+6reaj9_OtKM2Y2Qy", chatId:-1001391780001, text:"Qorovulbozor tumani"},
// ];
const DISTRICTS = [
    { id: 1, url: "https://t.me/+Z3DlAzweTlIwYTIy", chatId: -1002029528634, text: "Buxoro shahri" },
    { id: 2, url: "https://t.me/+hNGXmVzZQCU4YzMy", chatId: -1001583005144, text: "Kogon shahri" },
    { id: 3, url: "https://t.me/+vsTKe6mkZMlkMTUy", chatId: -1002129546888, text: "Buxoro tumani" },
    { id: 4, url: "https://t.me/+Q7aZkyB_c944OTJi", chatId: -1001924206262, text: "Vobkent tumani" },
    { id: 5, url: "https://t.me/+_kWVduBI4wljOWZi", chatId: -1002078101140, text: "Jondor tumani" },
    { id: 6, url: "https://t.me/+kCv4xLn0_rE0N2E6", chatId: -1002042813809, text: "Kogon tumani" },
    { id: 7, url: "https://t.me/+NSqrxi4WaJlhNjQy", chatId: -1002081373099, text: "Olot tumani" },
    { id: 8, url: "https://t.me/+ULgiocXglZxjMzhi", chatId: -1002103281360, text: "Peshku tumani" },
    { id: 9, url: "https://t.me/+7up_grmhvKYzMjBi", chatId: -1002048226046, text: "Romitan tumani" },
    { id: 10, url: "https://t.me/+yt6NVblUAiFjN2Ey", chatId: -1002099152003, text: "Shofirkon tumani" },
    { id: 11, url: "https://t.me/+6dBQk2PuzZBlNjM6", chatId: -1001824816624, text: "Qorako'l tumani" },
    { id: 12, url: "https://t.me/+7oCjG2J9aP9lNWNi", chatId: -1002052080418, text: "G'ijduvon tumani" },
    { id: 13, url: "https://t.me/+6reaj9_OtKM2Y2Qy", chatId: -1001965629595, text: "Qorovulbozor tumani" },
];
const districtButtons = () => {
    try {
        const buttons = DISTRICTS.map((d) => {
            return { text: d.text };
        });
        const keyboards = (0, functions_1.chunkArray)(buttons, 2);
        return keyboards;
    }
    catch (_a) {
        return [];
    }
};
exports.districtButtons = districtButtons;
exports.default = DISTRICTS;
