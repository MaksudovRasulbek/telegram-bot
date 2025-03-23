import mongoose, { Schema } from "mongoose";
import {  IRegionalOrder } from "../types/orders";

const schema : Schema<IRegionalOrder> = new Schema<IRegionalOrder>({
    fromRegionId: { type: Number, required: true },
    toRegionId: { type: Number, required: true },
    status: { type: String, default: "pending" },
    userId: { type: Number, required: true },
    driverId: { type: Number, default: 1 },
    summa: { type: Number, required: true, min: 1000 },
    from: { type: String, required: true },
    to: { type: String, required: true },
    messageId: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const REGIONALORDERS = mongoose.model<IRegionalOrder>("qq_taxi_regional_orders", schema);

export default REGIONALORDERS;
