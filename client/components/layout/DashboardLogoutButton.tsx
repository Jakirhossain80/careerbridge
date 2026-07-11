"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { appToast } from "@/lib/toast";

type DashboardLogoutButtonProps = {
  variant?: "default" | "admin";
};

export default function DashboardLogoutButton({
  variant = "default",
}: DashboardLogoutButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isAdmin = variant === "admin";

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      appToast.success("Signed out successfully.");
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } catch {
      setIsLoggingOut(false);
      appToast.error("Unable to sign out. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 ${
        isAdmin
          ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950"
      }`}
      aria-busy={isLoggingOut || undefined}
    >
      {isLoggingOut ? (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      Logout
    </button>
  );
}
