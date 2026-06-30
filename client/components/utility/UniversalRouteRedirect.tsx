"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCcw, UserRound } from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button, Card } from "@/components/ui";
import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/hooks/useAuth";
import type { DashboardRole } from "@/lib/authRedirects";
import { syncAuthenticatedUser } from "@/services/auth.service";

type UniversalRouteRedirectProps = {
  getPathForRole: (role?: DashboardRole | null) => string | null;
  loadingTitle: string;
  loadingMessage: string;
  fallbackTitle: string;
  fallbackMessage: string;
};

function isDashboardRole(role: unknown): role is DashboardRole {
  return (
    role === "job_seeker" ||
    role === "employer" ||
    role === "admin" ||
    role === "super_admin" ||
    role === "recruiter" ||
    role === "moderator"
  );
}

function UniversalRouteRedirectContent({
  getPathForRole,
  loadingTitle,
  loadingMessage,
  fallbackTitle,
  fallbackMessage,
}: UniversalRouteRedirectProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isResolvingRole, setIsResolvingRole] = useState(true);
  const [role, setRole] = useState<DashboardRole | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    let isMounted = true;

    async function resolveRole() {
      setIsResolvingRole(true);
      setError("");

      try {
        const syncedUser = await syncAuthenticatedUser();
        const resolvedRole = isDashboardRole(syncedUser.role)
          ? syncedUser.role
          : null;
        const redirectPath = getPathForRole(resolvedRole);

        if (!isMounted) {
          return;
        }

        setRole(resolvedRole);

        if (syncedUser.status === "blocked" || syncedUser.status === "suspended") {
          router.replace("/account-blocked");
          return;
        }

        if (syncedUser.status === "pending") {
          router.replace("/account-pending");
          return;
        }

        if (redirectPath) {
          router.replace(redirectPath);
          return;
        }
      } catch {
        if (isMounted) {
          setError("Unable to confirm your account role.");
        }
      } finally {
        if (isMounted) {
          setIsResolvingRole(false);
        }
      }
    }

    void resolveRole();

    return () => {
      isMounted = false;
    };
  }, [getPathForRole, loading, router, user]);

  if (loading || isResolvingRole) {
    return <PageLoader title={loadingTitle} message={loadingMessage} />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
        <Card className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-lg bg-red-50 text-red-700">
            <AlertCircle className="size-6" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{error}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Please retry the request or contact support if the issue continues.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              onClick={() => window.location.reload()}
              leftIcon={<RefreshCcw className="size-4" aria-hidden="true" />}
            >
              Try Again
            </Button>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Contact Support
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <Card className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserRound className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-foreground">{fallbackTitle}</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          {fallbackMessage}
        </p>
        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-950">Account:</span>{" "}
            {user?.displayName ?? user?.email ?? "Signed-in user"}
          </p>
          {user?.email ? (
            <p className="mt-1">
              <span className="font-semibold text-slate-950">Email:</span>{" "}
              {user.email}
            </p>
          ) : null}
          <p className="mt-1">
            <span className="font-semibold text-slate-950">Role:</span>{" "}
            {role ?? "not assigned"}
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Contact Support
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Go Home
          </Link>
        </div>
      </Card>
    </main>
  );
}

export default function UniversalRouteRedirect(
  props: UniversalRouteRedirectProps,
) {
  return (
    <ProtectedRoute>
      <UniversalRouteRedirectContent {...props} />
    </ProtectedRoute>
  );
}
