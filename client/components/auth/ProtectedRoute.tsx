"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, reload } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [canViewPage, setCanViewPage] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setCanViewPage(false);
        setIsCheckingAuth(false);
        router.replace(`${loginPath}?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        await reload(currentUser);
      } catch {
        setCanViewPage(false);
        setIsCheckingAuth(false);
        router.replace(`${loginPath}?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!currentUser.emailVerified) {
        setCanViewPage(false);
        setIsCheckingAuth(false);
        router.replace(verifyEmailPath);
        return;
      }

      setCanViewPage(true);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, [loginPath, pathname, router, verifyEmailPath]);

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
