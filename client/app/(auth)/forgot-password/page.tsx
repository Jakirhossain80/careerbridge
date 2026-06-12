"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { getFriendlyAuthErrorMessage } from "@/lib/auth-errors";
import { sendPasswordResetLink } from "@/lib/firebase";

type ForgotPasswordErrors = {
  email?: string;
  form?: string;
};

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/help", label: "Help Center" },
  { href: "/support", label: "Contact Support" },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSendingResetLink, setIsSendingResetLink] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});

  const validateForm = () => {
    const nextErrors: ForgotPasswordErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSendResetLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      setResetEmailSent(false);
      return;
    }

    setIsSendingResetLink(true);
    setResetEmailSent(false);
    setErrors({});

    try {
      await sendPasswordResetLink(email.trim());
      setResetEmailSent(true);
    } catch (error) {
      setErrors({
        form: getFriendlyAuthErrorMessage(error),
      });
    } finally {
      setIsSendingResetLink(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-primary"
            aria-label="CareerBridge home"
          >
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-white shadow-sm shadow-blue-900/10">
              <BriefcaseBusiness className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-xl font-bold sm:text-2xl">
              CareerBridge
            </span>
          </Link>

          <nav
            aria-label="Forgot password navigation"
            className="flex items-center gap-4 text-sm"
          >
            <Link
              href="/register"
              className="hidden font-medium text-muted transition hover:text-primary sm:inline"
            >
              Join Now
            </Link>
            <Link
              href="/login"
              className="font-semibold text-primary transition hover:text-blue-700"
            >
              Sign In
            </Link>
          </nav>
        </header>

        <section className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-10 lg:py-12">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-surface p-6 shadow-xl shadow-slate-950/5 sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-50 text-primary ring-8 ring-blue-50/60">
                <LockKeyhole className="size-8" aria-hidden="true" />
              </div>
              <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">
                Forgot Password?
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted">
                Enter the email connected to your CareerBridge account and we
                will send you a secure link to reset your password.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSendResetLink}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <div className="relative mt-2">
                  <Mail
                    className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (resetEmailSent) {
                        setResetEmailSent(false);
                      }
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 pl-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p
                  id="email-error"
                  className="mt-2 min-h-5 text-sm text-red-600"
                  aria-live="polite"
                >
                  {errors.email}
                </p>
              </div>

              {errors.form ? (
                <p
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {errors.form}
                </p>
              ) : null}

              {resetEmailSent ? (
                <div
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800"
                  role="status"
                >
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-5 flex-none"
                      aria-hidden="true"
                    />
                    <p>
                      Reset link sent. Check your inbox for instructions to
                      create a new password.
                    </p>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSendingResetLink}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isSendingResetLink ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Sending reset link
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-5">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 font-semibold text-primary transition hover:text-blue-700"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to Login
              </Link>
              <Link
                href="/support"
                className="font-medium text-muted transition hover:text-primary"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 text-sm text-muted sm:justify-between">
          <p>Copyright 2026 CareerBridge</p>
          <nav aria-label="Forgot password footer">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </div>
    </main>
  );
}
