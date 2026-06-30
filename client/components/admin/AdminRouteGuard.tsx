"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const checkRole = async () => {
      const syncedUser = profile ?? (await refreshProfile());
      const token = syncedUser ? null : await user.getIdTokenResult();
      const role = syncedUser?.role ?? token?.claims.role;

      if (role === "admin" || role === "super_admin") {
        setAllowed(true);
        return;
      }

      setAllowed(false);
      router.replace("/unauthorized");
    };

    void checkRole();
  }, [loading, profile, refreshProfile, router, user]);

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-surface p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">Checking admin access</p>
          <p className="mt-2 text-sm text-muted">Please wait while permissions load.</p>
        </section>
      </main>
    );
  }

  return children;
}
