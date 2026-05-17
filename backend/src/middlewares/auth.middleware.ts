import { NextFunction,Request,Response } from "express";
import { UserRole } from "../types/user.types";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";

interface DecodedToken {
    userId:string,
    role:UserRole,
    exp:number,
    iat:number
} 
export const protect = async(req:Request,res:Response,next:NextFunction):Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access Denied, token not provided!",401)
    }
    const token = authHeader.split(" ")[1];
    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
    throw new AppError("JWT secret is not configured", 500);
  }
    try {
        const decoded = jwt.verify(token,jwt_secret) as DecodedToken;
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        }
        next();
        }
         catch (error) {
        throw new AppError("Invalid or expired token!",500)
    }
}

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("User is not authenticated", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("You are not allowed to perform this action", 403);
    }

    next();
  };
};