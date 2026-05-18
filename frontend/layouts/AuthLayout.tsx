import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-8 md:px-12 py-6">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
};