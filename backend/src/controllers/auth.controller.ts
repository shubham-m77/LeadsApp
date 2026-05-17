import mongoose from "mongoose";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { AppError } from "../utils/AppError";
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/jwt";

// Register User controller
export const registerUserController = async (req: Request, res: Response): Promise<Response> => {
    const data = registerSchema.parse(req.body);
    if (!data) {
        throw new AppError("Data not recieved from body", 401);
    }
    try {
        const isExistingUser = await User.findOne({ email: data.email });
        if (isExistingUser) {
            throw new AppError("User already registered!", 400);
        }
        const hashedPass = await bcrypt.hash(data.password, 10);
        const response = await User.create({
            email: data.email,
            name: data.name,
            password: hashedPass,
            role: data.role || "sales"
        });
        if (!response) {
            throw new AppError("User not created", 402)
        }
        const token = await generateToken({
            userId: response._id.toString(),
            role: response.role
        })
        if (!token) {
            throw new AppError("token not generated!", 402)
        }
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: response._id,
                name: response.name,
                email: response.email,
                role: response.role
            },
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User not registered!"
        })
    }
}

// Login user controller 
export const loginUserController = async (req: Request, res: Response): Promise<Response>=>{
    try {
        const data = loginSchema.parse(req.body);
        if (!data) {
            throw new AppError("Data not recieved!", 403);
        }
        const userData = await User.findOne({ email: data.email });
        if (!userData) {
            throw new AppError("Invalid email address or password!", 401)
        }
        const isPasswordValid = await bcrypt.compare(data.password, userData.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid email address or password!", 401)
        }
        const token = await generateToken({
            userId: userData._id.toString(),
            role: userData.role
        })
        if (!token) {
            throw new AppError("Unfortunately!, token not generated", 402)
        }
        return res.status(201).json({
            success: true,
            message: "User loggined successfully",
            token,
            user: {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role
            },
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User not registered!"
        })
    }
}

// get user

export const getMe = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = req.user;
        if (!user) {
            throw new AppError("User not found!", 404)
        }
        return res.status(200).json({
            success: true,
            message: "User fetched successfully!",
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user!"
        })
    }
}

// admin only

export const adminController  = async(req:Request,res:Response):Promise<Response> => {
    return res.status(201).json({
        success:true,
        message:"Welcome Admin!"
    })
}