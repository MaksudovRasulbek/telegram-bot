import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/users";

// user schema
// status userni kim ekanligini bilish uchun ya'ni oddiy usermi yoki adminstrator, agarda bloklansa "blocked" statusini oladi va botni ishlata olmaydi
const userSchema: Schema<IUser> = new Schema<IUser>({
    name: { type: String, required: true },
    phone: { type: String, default:"0" },
    chatId: { type: Number, required: true },
    status: { type: String, default: "user" },
    city: {type: Number, default:0} 
});

const USERS = mongoose.model<IUser>("qq_taxi_users", userSchema);

export default USERS;