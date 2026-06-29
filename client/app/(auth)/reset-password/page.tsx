"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  RotateCcwKey,
} from "lucide-react";
import { getFriendlyAuthErrorMessage } from "@/lib/auth-errors";
import { confirmPasswordResetWithCode } from "@/lib/firebase";
import { appToast } from "@/lib/toast";

type ResetPasswordErrors = {
  password?: string;
  confirmPassword?: string;
  form?: string;
};

type PasswordRule = {
  id: string;
  label: string;
  isValid: boolean;
};

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/help", label: "Help Center" },
  { href: "/support", label: "Contact Support" },
];

const getPasswordRules = (password: string): PasswordRule[] => [
  {
    id: "length",
    label: "At least 8 characters",
    isValid: password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    isValid: /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    isValid: /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    isValid: /\d/.test(password),
  },
  {
    id: "special",
    label: "One special character",
    isValid: /[^A-Za-z0-9]/.test(password),
  },
];

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-surface p-6 text-center shadow-sm">
        <p className="text-sm font-medium">Loading reset password</p>
      </div>
    </main>
  );
}

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetComplete, setPasswordResetComplete] = useState(false);
  const [errors, setErrors] = useState<ResetPasswordErrors>(() =>
    oobCode
      ? {}
      : {
          form: "This reset link is missing required information. Request a new password reset link.",
        }
  );

  const passwordRules = useMemo(() => getPasswordRules(password), [password]);
  const hasResetCode = Boolean(oobCode);

  const validateForm = () => {
    const nextErrors: ResetPasswordErrors = {};
    const failedPasswordRules = passwordRules.filter((rule) => !rule.isValid);

    if (!hasResetCode) {
      nextErrors.form =
        "This reset link is missing required information. Request a new password reset link.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (failedPasswordRules.length > 0) {
      nextErrors.password = "Password does not meet all requirements.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      setPasswordResetComplete(false);
      return;
    }

    setIsResettingPassword(true);
    setPasswordResetComplete(false);
    setErrors({});

    try {
      await confirmPasswordResetWithCode(oobCode, password);
      setPasswordResetComplete(true);
      setPassword("");
      setConfirmPassword("");
      appToast.success("Password reset successfully.");
    } catch (error) {
      const message = getFriendlyAuthErrorMessage(error);
      setErrors({
        form: message,
      });
      appToast.error(message);
    } finally {
      setIsResettingPassword(false);
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
            aria-label="Reset password navigation"
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
                <RotateCcwKey className="size-8" aria-hidden="true" />
              </div>
              <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">
                Reset Password
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted">
                Create a new password for your CareerBridge account. Use a
                strong password you have not used before.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleResetPassword}>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  New password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    disabled={passwordResetComplete}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (passwordResetComplete) {
                        setPasswordResetComplete(false);
                      }
                    }}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password
                        ? "password-error password-rules"
                        : "password-rules"
                    }
                    placeholder="Create a new password"
                    className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={passwordResetComplete}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-slate-500 transition hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" aria-hidden="true" />
                    ) : (
                      <Eye className="size-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <p
                  id="password-error"
                  className="mt-2 min-h-5 text-sm text-red-600"
                  aria-live="polite"
                >
                  {errors.password}
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-foreground"
                >
                  Confirm password
                </label>
                <div className="relative mt-2">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    disabled={passwordResetComplete}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      if (passwordResetComplete) {
                        setPasswordResetComplete(false);
                      }
                    }}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                    placeholder="Confirm new password"
                    className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    disabled={passwordResetComplete}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-slate-500 transition hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-5" aria-hidden="true" />
                    ) : (
                      <Eye className="size-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <p
                  id="confirm-password-error"
                  className="mt-2 min-h-5 text-sm text-red-600"
                  aria-live="polite"
                >
                  {errors.confirmPassword}
                </p>
              </div>

              <div
                id="password-rules"
                className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                {passwordRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`flex items-center gap-2 text-sm ${
                      rule.isValid ? "text-emerald-700" : "text-muted"
                    }`}
                  >
                    <span
                      className={`flex size-5 flex-none items-center justify-center rounded-full border ${
                        rule.isValid
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-300 bg-white"
                      }`}
                      aria-hidden="true"
                    >
                      {rule.isValid ? <Check className="size-3" /> : null}
                    </span>
                    {rule.label}
                  </div>
                ))}
              </div>

              {errors.form ? (
                <p
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {errors.form}
                </p>
              ) : null}

              {passwordResetComplete ? (
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
                      Your password has been reset. You can now sign in with
                      your new password.
                    </p>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isResettingPassword || passwordResetComplete}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Resetting password
                  </>
                ) : (
                  <>
                    Reset Password
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
                href="/forgot-password"
                className="font-medium text-muted transition hover:text-primary"
              >
                Request new link
              </Link>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 text-sm text-muted sm:justify-between">
          <p>Copyright 2026 CareerBridge</p>
          <nav aria-label="Reset password footer">
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
