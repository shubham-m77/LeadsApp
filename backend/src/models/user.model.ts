import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import {UserRole} from "../types/user.types";

export interface IUserDoc extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    role: UserRole;
}
const userSchema = new Schema<IUserDoc>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    role: {type: String, enum: ['admin', 'sales'], required: true},
},{
    timestamps:true
});


export const User = mongoose.model<IUserDoc>("User", userSchema);