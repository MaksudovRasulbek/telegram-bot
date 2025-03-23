import { KEYBOARDS } from "../../constants";

export const TRUCKS = ["damas", "kamaz", "fura", "labo", "moto"];

export const submitDriverButtons = [
    [{text:KEYBOARDS.confirm}],
    [{text:KEYBOARDS.editOrder}],
    [{text:KEYBOARDS.cancel}],
];

export const editDriverButtons = [
    {key:"name", text:KEYBOARDS.name},
    {key:"phoneNumber", text:KEYBOARDS.phoneNumber},
    {key:"carModel", text:KEYBOARDS.carModel},
    {key:"carNumber", text:KEYBOARDS.carNumber},
];
