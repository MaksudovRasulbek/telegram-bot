import mongoose, { Schema } from "mongoose";
import { IOrder } from "../types/orders";

const orderSchema : Schema<IOrder> = new Schema<IOrder>({
    districtId: { type: Number, required: true },
    status: { type: String, default: "pending" },
    userId: { type: Number, required: true },
    driverId: { type: Number, default: 1 },
    summa: { type: Number, required: true, min: 100 },
    from: { type: String, required: true },
    to: { type: String, required: true },
    messageId: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ORDERS = mongoose.model<IOrder>("qq_taxi_orders", orderSchema);

export default ORDERS;
