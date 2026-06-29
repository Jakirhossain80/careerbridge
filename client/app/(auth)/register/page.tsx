"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  UserRound,
} from "lucide-react";
import { getFriendlyAuthErrorMessage } from "@/lib/auth-errors";
import {
  loginWithGooglePopup,
  registerWithEmailAndVerification,
} from "@/lib/firebase";
import { appToast } from "@/lib/toast";
import { ValidationMessage } from "@/components/ui";

type RegisterRole = "job_seeker" | "employer";

type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
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

const roleOptions: Array<{
  value: RegisterRole;
  title: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    value: "job_seeker",
    title: "Job Seeker",
    description: "Build your profile and discover roles that fit your skills.",
    icon: UserRound,
  },
  {
    value: "employer",
    title: "Employer",
    description: "Find qualified talent and manage hiring from one place.",
    icon: Building2,
  },
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

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RegisterRole>("job_seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isContinuingWithGoogle, setIsContinuingWithGoogle] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const passwordRules = useMemo(() => getPasswordRules(password), [password]);

  const validateForm = () => {
    const nextErrors: RegisterErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const failedPasswordRules = passwordRules.filter((rule) => !rule.isValid);

    if (!trimmedName) {
      nextErrors.name = "Full name is required.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
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

    if (!acceptedTerms) {
      nextErrors.terms = "You must accept the terms and privacy policy.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsCreatingAccount(true);
    setErrors({});

    try {
      await registerWithEmailAndVerification({
        email: email.trim(),
        password,
        name: name.trim(),
      });

      // TODO: Persist selectedRole when a user profile API or Firestore profile
      // writer is added. The auth utility currently stores Firebase Auth data.
      appToast.success("Account created successfully.");
      router.push("/verify-email");
    } catch (error) {
      const message = getFriendlyAuthErrorMessage(error);
      setErrors({
        form: message,
      });
      appToast.error(message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleGoogleRegistration = async () => {
    setIsContinuingWithGoogle(true);
    setErrors({});

    try {
      const user = await loginWithGooglePopup();

      // TODO: Persist selectedRole when a user profile API or Firestore profile
      // writer is added for Google registration.
      if (!user.emailVerified) {
        appToast.info("Please verify your email to continue.");
        router.push("/verify-email");
        return;
      }

      appToast.success("Signed in successfully.");
      router.push("/dashboard");
    } catch (error) {
      const message = getFriendlyAuthErrorMessage(error);
      setErrors({
        form: message,
      });
      appToast.error(message);
    } finally {
      setIsContinuingWithGoogle(false);
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
            aria-label="Registration navigation"
            className="flex items-center gap-4 text-sm"
          >
            <Link
              href="/help"
              className="hidden font-medium text-muted transition hover:text-primary sm:inline"
            >
              Help Center
            </Link>
            <Link
              href="/login"
              className="font-semibold text-primary transition hover:text-blue-700"
            >
              Sign In
            </Link>
          </nav>
        </header>

        <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 py-10 lg:py-12">
          <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-surface p-6 shadow-xl shadow-slate-950/5 sm:p-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase text-primary">
                Join CareerBridge
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold text-foreground">
                Create your account
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted">
                Choose your role and get started today.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleCreateAccount}>
              <fieldset>
                <legend className="text-sm font-medium text-foreground">
                  Choose your role
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {roleOptions.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.value;

                    return (
                      <label
                        key={role.value}
                        className={`relative flex cursor-pointer gap-3 rounded-md border p-4 transition ${
                          isSelected
                            ? "border-primary bg-blue-50 ring-2 ring-primary/20"
                            : "border-slate-200 bg-white hover:border-primary/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={isSelected}
                          onChange={() => setSelectedRole(role.value)}
                          className="sr-only"
                        />
                        <span
                          className={`flex size-10 flex-none items-center justify-center rounded-md ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-950">
                            {role.title}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-muted">
                            {role.description}
                          </span>
                        </span>
                        {isSelected ? (
                          <CheckCircle2
                            className="absolute right-3 top-3 size-5 text-primary"
                            aria-hidden="true"
                          />
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  placeholder="Your name"
                  className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <ValidationMessage id="name-error" className="mt-2 min-h-5">
                  {errors.name}
                </ValidationMessage>
              </div>

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

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password
                          ? "password-error password-rules"
                          : "password-rules"
                      }
                      placeholder="Create a password"
                      className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-slate-500 transition hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirm-password-error"
                          : undefined
                      }
                      placeholder="Confirm password"
                      className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-slate-500 transition hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                  <ValidationMessage
                    id="confirm-password-error"
                    className="mt-2 min-h-5"
                  >
                    {errors.confirmPassword}
                  </ValidationMessage>
                </div>
              </div>

              <div
                id="password-rules"
                className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"
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

              <div>
                <label className="flex items-start gap-3 text-sm leading-6 text-muted">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) =>
                      setAcceptedTerms(event.target.checked)
                    }
                    aria-invalid={Boolean(errors.terms)}
                    aria-describedby={errors.terms ? "terms-error" : undefined}
                    className="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-semibold text-primary transition hover:text-blue-700"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-primary transition hover:text-blue-700"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                <ValidationMessage id="terms-error" className="mt-2 min-h-5">
                  {errors.terms}
                </ValidationMessage>
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
                disabled={isCreatingAccount || isContinuingWithGoogle}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isCreatingAccount ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Creating account
                  </>
                ) : (
                  <>
                    Create account
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
              onClick={handleGoogleRegistration}
              disabled={isCreatingAccount || isContinuingWithGoogle}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {isContinuingWithGoogle ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Continuing with Google
                </>
              ) : (
                <>
                  <span
                    className="flex size-5 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-primary"
                    aria-hidden="true"
                  >
                    G
                  </span>
                  Continue with Google
                </>
              )}
            </button>

            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary transition hover:text-blue-700"
              >
                Login
              </Link>
            </p>
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 text-sm text-muted sm:justify-between">
          <p>Copyright 2026 CareerBridge</p>
          <nav aria-label="Registration footer">
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
