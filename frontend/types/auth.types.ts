export type UserRole = "sales" | "admin"

export interface User {
    id: string,
    name: string,
    email: string,
    role: UserRole
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
    token: string;
}

export interface loginInput {
    email: string;
    password: string;
}

export interface registerInput {
    name:string
    email: string;
    password: string;
    role?:UserRole
}