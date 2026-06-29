"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { getFriendlyAuthErrorMessage } from "@/lib/auth-errors";
import { loginWithEmailAndPassword, loginWithGooglePopup } from "@/lib/firebase";
import { appToast } from "@/lib/toast";
import { ValidationMessage } from "@/components/ui";

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/help", label: "Help Center" },
  { href: "/support", label: "Contact Support" },
];

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-surface p-6 text-center shadow-sm">
        <p className="text-sm font-medium">Loading sign in</p>
      </div>
    </main>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const redirectPath = useMemo(() => {
    const requestedPath = searchParams.get("redirect");
    return requestedPath?.startsWith("/") ? requestedPath : "/dashboard";
  }, [searchParams]);

  const validateForm = () => {
    const nextErrors: LoginErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSigningIn(true);
    setErrors({});

    try {
      const user = await loginWithEmailAndPassword({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (!user.emailVerified) {
        appToast.info("Please verify your email to continue.");
        router.push("/verify-email");
        return;
      }

      appToast.success("Signed in successfully.");
      router.push(redirectPath);
    } catch (error) {
      const message = getFriendlyAuthErrorMessage(error);
      setErrors({
        form: message,
      });
      appToast.error(message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningInWithGoogle(true);
    setErrors({});

    try {
      const user = await loginWithGooglePopup();

      if (!user.emailVerified) {
        appToast.info("Please verify your email to continue.");
        router.push("/verify-email");
        return;
      }

      appToast.success("Signed in successfully.");
      router.push(redirectPath);
    } catch (error) {
      const message = getFriendlyAuthErrorMessage(error);
      setErrors({
        form: message,
      });
      appToast.error(message);
    } finally {
      setIsSigningInWithGoogle(false);
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

          <p className="text-right text-sm text-muted">
            <span className="hidden sm:inline">New to CareerBridge? </span>
            <Link
              href="/register"
              className="font-semibold text-primary transition hover:text-blue-700"
            >
              Join Now
            </Link>
          </p>
        </header>

        <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 py-10 lg:py-12">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-surface p-6 shadow-xl shadow-slate-950/5 sm:p-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase text-primary">
                Sign in
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">
                Welcome back
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted">
                Access applications, saved roles, and your CareerBridge
                dashboard.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleEmailSignIn}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  placeholder="you@example.com"
                  className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <ValidationMessage id="email-error" className="mt-2 min-h-5">
                  {errors.email}
                </ValidationMessage>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary transition hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-slate-500 transition hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" aria-hidden="true" />
                    ) : (
                      <Eye className="size-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <ValidationMessage id="password-error" className="mt-2 min-h-5">
                  {errors.password}
                </ValidationMessage>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-3 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                  />
                  Remember me
                </label>
              </div>

              {errors.form ? (
                <p
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {errors.form}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSigningIn || isSigningInWithGoogle}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Signing in
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase text-muted">
                Or continue with
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn || isSigningInWithGoogle}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {isSigningInWithGoogle ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Signing in with Google
                </>
              ) : (
                <>
                  <span
                    className="flex size-5 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-primary"
                    aria-hidden="true"
                  >
                    G
                  </span>
                  Sign in with Google
                </>
              )}
            </button>
          </div>

          <aside className="hidden w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:block">
            <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-md bg-slate-950 p-6 text-white">
                <p className="text-sm font-semibold uppercase text-emerald-300">
                  Career snapshot
                </p>
                <p className="mt-4 font-heading text-2xl font-bold leading-tight">
                  Keep your next move organized from one focused workspace.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-white/10 p-4">
                    <p className="text-2xl font-bold">24</p>
                    <p className="mt-1 text-xs text-slate-300">Saved roles</p>
                  </div>
                  <div className="rounded-md bg-white/10 p-4">
                    <p className="text-2xl font-bold">8</p>
                    <p className="mt-1 text-xs text-slate-300">
                      Skill matches
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4">
                {[
                  "Track applications without losing context.",
                  "Compare roles against your verified skill profile.",
                  "Return to the dashboard exactly where you left off.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-4"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 flex-none text-accent"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium leading-6 text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 text-sm text-muted sm:justify-between">
          <p>Copyright 2026 CareerBridge</p>
          <nav aria-label="Login footer">
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
