import type { UserRole } from "../types/auth.types";

const TOKEN_KEY = "smart_leads_token";
const USER_NAME_KEY = "smart_leads_user_name";
const USER_ROLE_KEY = "smart_leads_user_role";

export const authStorage = {
  setAuth: (token: string, name: string, role: UserRole) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_NAME_KEY, name);
    localStorage.setItem(USER_ROLE_KEY, role);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUserName: () => {
    return localStorage.getItem(USER_NAME_KEY);
  },

  getUserRole: () => {
    return localStorage.getItem(USER_ROLE_KEY) as UserRole | null;
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
  },

  isAuthenticated: () => {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  }
};