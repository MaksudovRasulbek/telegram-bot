import mongoose, { Schema } from "mongoose";
import { IDriver } from "../types/drivers";

// user schema
// status userni kim ekanligini bilish uchun ya'ni oddiy usermi yoki adminstrator, agarda bloklansa "blocked" statusini oladi va botni ishlata olmaydi
const driverSchema: Schema<IDriver> = new Schema<IDriver>({
    carModel: { type: String, required: true },
    carNumber: { type: String, required: true },
    chatId: { type: Number, required: true },
    balance: { type: Number, default:0 },
    districtId: { type: Number, required:true },
    status: { type: String, default: "pending" },
},{
    timestamps: true
});

const DRIVERS = mongoose.model<IDriver>("qq_taxi_drivers", driverSchema);

export default DRIVERS;