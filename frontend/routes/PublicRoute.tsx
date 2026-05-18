import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = localStorage.getItem("smart_leads_token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};