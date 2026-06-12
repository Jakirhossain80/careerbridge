"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Mail, RefreshCw } from "lucide-react";
import { getFriendlyAuthErrorMessage } from "@/lib/auth-errors";
import {
  reloadCurrentUserAndCheckEmailVerified,
  sendVerificationEmail,
} from "@/lib/firebase";
import { getDashboardPathForRole } from "@/lib/authRedirects";
import { useAuth } from "@/hooks/useAuth";

const getDashboardRedirectPath = () => {
  // Replace this with the role-based dashboard path when dashboard routes exist.
  return getDashboardPathForRole();
};

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.emailVerified) {
      router.replace(getDashboardRedirectPath());
    }
  }, [router, user]);

  const handleResendVerification = async () => {
    setError("");
    setMessage("");
    setIsSending(true);

    try {
      await sendVerificationEmail(user);
      setMessage("Verification email sent. Please check your inbox.");
    } catch (sendError) {
      setError(getFriendlyAuthErrorMessage(sendError));
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckVerificationStatus = async () => {
    setError("");
    setMessage("");
    setIsChecking(true);

    try {
      const isVerified = await reloadCurrentUserAndCheckEmailVerified();

      if (isVerified) {
        setMessage("Email verified. Redirecting...");
        router.replace(getDashboardRedirectPath());
        return;
      }

      setMessage("Email is not verified yet. Please check your inbox.");
    } catch (checkError) {
      setError(getFriendlyAuthErrorMessage(checkError));
    } finally {
      setIsChecking(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <p className="text-sm font-medium text-zinc-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-5 flex size-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <AlertCircle size={22} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-950">
            Sign in required
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            You need to be signed in before verifying your email address.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <section className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <Mail size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950">
              Verify your email
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              We sent a verification link to your email address.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Email address
          </p>
          <p className="mt-1 break-words text-sm font-medium text-zinc-950">
            {user.email}
          </p>
        </div>

        {message ? (
          <div className="mt-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2
              className="mt-0.5 shrink-0"
              size={18}
              aria-hidden="true"
            />
            <p>{message}</p>
          </div>
        ) : null}

        {error ? (
          <div className="mt-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle
              className="mt-0.5 shrink-0"
              size={18}
              aria-hidden="true"
            />
            <p>{error}</p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={isSending || isChecking}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            <Mail size={17} aria-hidden="true" />
            {isSending ? "Sending..." : "Resend email"}
          </button>
          <button
            type="button"
            onClick={handleCheckVerificationStatus}
            disabled={isSending || isChecking}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400"
          >
            <RefreshCw size={17} aria-hidden="true" />
            {isChecking ? "Checking..." : "Check status"}
          </button>
        </div>
      </section>
    </main>
  );
}
