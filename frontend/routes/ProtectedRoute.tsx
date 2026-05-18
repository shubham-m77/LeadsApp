import { ReactNode } from "react"
import {Navigate} from "react-router-dom"

export const ProtectedRoute = ({children}:{children:ReactNode}) => {
    if(!localStorage.getItem("smart_leads_token")){
        return <Navigate to={"/login"} replace/>
    }
    return children;
}