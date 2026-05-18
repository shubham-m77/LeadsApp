import { AuthResponse, loginInput, registerInput } from "../types/auth.types";
import {api} from "./axios"

export const authApi = {
    register:async(data:registerInput):Promise<AuthResponse> => {
         const response = await api.post<AuthResponse>("/auth/register",data);
         return response.data;
    },
    login:async(data:loginInput):Promise<AuthResponse> => {
         const response = await api.post<AuthResponse>("/auth/login",data);
         return response.data;
    }
}