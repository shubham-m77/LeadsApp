import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import {iUser} from "../types/user.types";


const userSchema = new Schema<iUser>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    role: {type: String, enum: ['admin', 'sales'], required: true},
},{
    timestamps:true
});


export const User = mongoose.model<iUser>("User", userSchema);