"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { reload } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
  loginPath?: string;
  verifyEmailPath?: string;
};

export default function ProtectedRoute({
  children,
  loginPath = "/login",
  verifyEmailPath = "/verify-email",
}: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [canViewPage, setCanViewPage] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    const checkAccess = async () => {
      if (!user) {
        setCanViewPage(false);
        setIsCheckingAuth(false);
        router.replace(`${loginPath}?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        await reload(user);
      } catch {
        setCanViewPage(false);
        setIsCheckingAuth(false);
        router.replace(`${loginPath}?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!user.emailVerified) {
        setCanViewPage(false);
        setIsCheckingAuth(false);
        router.replace(verifyEmailPath);
        return;
      }

      setCanViewPage(true);
      setIsCheckingAuth(false);
    };

    void checkAccess();
  }, [loading, loginPath, pathname, router, user, verifyEmailPath]);

  if (isCheckingAuth || !canViewPage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <section className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-zinc-950">
            Checking your account
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Please wait while we verify your access.
          </p>
        </section>
      </main>
    );
  }

  return children;
}
