import type { ReactNode } from "react"
import {Navigate} from "react-router-dom"
import { authStorage } from "../utils/authStorage";

export const ProtectedRoute = ({children}:{children:ReactNode}) => {
    if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
    return children;
}