import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { authStorage } from "../utils/authStorage";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const userName = authStorage.getUserName();
  const userRole = authStorage.getUserRole();

  const handleLogout = () => {
    authStorage.clearAuth();
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-slate-50 ">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 md:px-12 py-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Smart Leads
            </h1>
            <p className="text-sm text-slate-500">Lead Management Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">
                {userName || "User"}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {userRole || "sales"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6">{children}</section>
    </main>
  );
};