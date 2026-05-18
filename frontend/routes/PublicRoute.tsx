import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authStorage } from "../utils/authStorage";

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
   if (authStorage.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};