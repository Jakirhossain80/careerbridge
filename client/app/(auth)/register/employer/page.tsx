"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  FileImage,
  Loader2,
  Mail,
  Sparkles,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { appToast } from "@/lib/toast";

type RecruiterRole =
  | "HR Manager"
  | "Talent Acquisition"
  | "Technical Recruiter"
  | "Hiring Manager"
  | "Founding Team Member";

type Industry =
  | "Technology"
  | "Finance"
  | "Healthcare"
  | "Education"
  | "Design & Creative";

type CompanySize =
  | "1-10 employees"
  | "11-50 employees"
  | "51-200 employees"
  | "201-500 employees"
  | "500+ employees";

type EmployerFormState = {
  recruiterName: string | undefined;
  workEmail: string | undefined;
  recruiterRole: "" | RecruiterRole;
  phone: string;
  companyName: string;
  companyWebsite: string;
  industry: "" | Industry;
  companySize: "" | CompanySize;
  companyBio: string;
  logoFile: File | null;
  acceptedTerms: boolean;
};

type EmployerFormErrors = Partial<
  Record<keyof EmployerFormState | "form", string>
>;

const recruiterRoles: RecruiterRole[] = [
  "HR Manager",
  "Talent Acquisition",
  "Technical Recruiter",
  "Hiring Manager",
  "Founding Team Member",
];

const industries: Industry[] = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Design & Creative",
];

const companySizes: CompanySize[] = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/help", label: "Help Center" },
  { href: "/support", label: "Contact Support" },
];

const trustPoints = [
  { label: "Verified Talent", icon: BadgeCheck },
  { label: "2x Faster Hiring", icon: Sparkles },
  { label: "5M+ Professionals", icon: UsersRound },
];

const trustedCompanies = ["Northstar Labs", "Apex Bank", "Medora Health", "BrightPath"];

const emptyFormState: EmployerFormState = {
  recruiterName: undefined,
  workEmail: undefined,
  recruiterRole: "",
  phone: "",
  companyName: "",
  companyWebsite: "",
  industry: "",
  companySize: "",
  companyBio: "",
  logoFile: null,
  acceptedTerms: false,
};

const maxLogoSize = 2 * 1024 * 1024;

export default function EmployerAccountCreationPage() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { user, loading: isAuthLoading } = useAuth();
  const [formState, setFormState] =
    useState<EmployerFormState>(emptyFormState);
  const [errors, setErrors] = useState<EmployerFormErrors>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const recruiterNameValue = formState.recruiterName ?? user?.displayName ?? "";
  const workEmailValue = formState.workEmail ?? user?.email ?? "";

  const updateField = <Field extends keyof EmployerFormState>(
    field: Field,
    value: EmployerFormState[Field]
  ) => {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  };

  const validateLogo = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    const hasAllowedExtension = /\.(jpe?g|png|svg)$/i.test(file.name);

    if (!allowedTypes.includes(file.type) && !hasAllowedExtension) {
      return "Upload a JPG, PNG, or SVG logo.";
    }

    if (file.size > maxLogoSize) {
      return "Company logo must be 2MB or smaller.";
    }

    return undefined;
  };

  const setLogoFile = (file: File | null) => {
    if (!file) {
      updateField("logoFile", null);
      return;
    }

    const logoError = validateLogo(file);

    setErrors((currentErrors) => ({
      ...currentErrors,
      logoFile: logoError,
    }));

    if (!logoError) {
      updateField("logoFile", file);
    }
  };

  const validateForm = () => {
    const nextErrors: EmployerFormErrors = {};
    const trimmedEmail = workEmailValue.trim();
    const trimmedWebsite = formState.companyWebsite.trim();

    if (!recruiterNameValue.trim()) {
      nextErrors.recruiterName = "Full name is required.";
    }

    if (!trimmedEmail) {
      nextErrors.workEmail = "Work email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.workEmail = "Enter a valid work email.";
    }

    if (!formState.recruiterRole) {
      nextErrors.recruiterRole = "Select your role.";
    }

    if (!formState.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    if (formState.logoFile) {
      const logoError = validateLogo(formState.logoFile);

      if (logoError) {
        nextErrors.logoFile = logoError;
      }
    }

    if (!formState.companyName.trim()) {
      nextErrors.companyName = "Company name is required.";
    }

    if (trimmedWebsite) {
      try {
        const parsedUrl = new URL(trimmedWebsite);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          nextErrors.companyWebsite = "Enter a valid website URL.";
        }
      } catch {
        nextErrors.companyWebsite = "Enter a valid website URL.";
      }
    }

    if (!formState.industry) {
      nextErrors.industry = "Select an industry.";
    }

    if (!formState.companySize) {
      nextErrors.companySize = "Select a company size.";
    }

    if (!formState.companyBio.trim()) {
      nextErrors.companyBio = "Company bio is required.";
    }

    if (!formState.acceptedTerms) {
      nextErrors.acceptedTerms =
        "You must confirm authorization and accept the terms.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => ({
    recruiterName: recruiterNameValue.trim(),
    workEmail: workEmailValue.trim(),
    recruiterRole: formState.recruiterRole,
    phone: formState.phone.trim(),
    companyName: formState.companyName.trim(),
    companyWebsite: formState.companyWebsite.trim(),
    industry: formState.industry,
    companySize: formState.companySize,
    companyBio: formState.companyBio.trim(),
    logoFile: formState.logoFile,
    role: "employer" as const,
    status: "pending" as const,
  });

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setErrors({});

    try {
      const payload = buildPayload();

      // TODO: Persist payload when an employer profile draft API is added.
      void payload;
      await Promise.resolve();
      appToast.success("Draft saved successfully.");
    } catch {
      const message = "We could not save your draft. Please try again.";
      setErrors({
        form: message,
      });
      appToast.error(message);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsCreatingAccount(true);
    setErrors({});

    try {
      const payload = buildPayload();

      // TODO: Send payload to the employer/company API when available, set user
      // role to employer, set verification status to pending, then redirect to
      // the account pending page from the backend-confirmed response.
      void payload;
      await Promise.resolve();
      appToast.success("Employer account submitted successfully.");
      router.push("/account-pending");
    } catch {
      const message = "We could not create your employer account. Please try again.";
      setErrors({
        form: message,
      });
      appToast.error(message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const isSubmitting = isSavingDraft || isCreatingAccount;

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
            aria-label="Employer registration navigation"
            className="flex items-center gap-4 text-sm"
          >
            <Link
              href="/login"
              className="font-semibold text-primary transition hover:text-blue-700"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
            >
              Join Now
            </Link>
          </nav>
        </header>

        <section className="mx-auto grid w-full max-w-7xl gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-12">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">
              Employer onboarding
            </p>
            <h1 className="mt-4 max-w-2xl font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Hire the next generation of industry leaders.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Companies use CareerBridge to discover verified professionals,
              build trusted talent pipelines, and move from opening to offer
              with less friction.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <div
                    key={point.label}
                    className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <span className="flex size-9 flex-none items-center justify-center rounded-md bg-blue-50 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <aside
            className="hidden rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10 lg:block"
            aria-label="Hiring activity preview"
          >
            <div className="relative min-h-[360px] overflow-hidden rounded-md bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.28),transparent_36%),linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#2563eb_100%)] p-6">
              <div className="grid gap-4">
                <div className="w-3/4 rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md bg-white text-primary">
                      <Building2 className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block h-3 w-3/5 rounded-full bg-white/70" />
                      <span className="mt-3 block h-2 w-4/5 rounded-full bg-white/30" />
                    </div>
                  </div>
                </div>

                <div className="ml-auto w-4/5 rounded-md border border-white/15 bg-white/95 p-5 text-slate-950 shadow-lg">
                  <p className="text-sm font-semibold text-muted">
                    Active listings
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <p className="font-heading text-4xl font-bold">12,480</p>
                    <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                      +18%
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-5 items-end gap-2">
                    {[44, 68, 52, 86, 74].map((height, index) => (
                      <span
                        key={index}
                        className="rounded-t bg-primary/80"
                        style={{ height }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
                {["Verified companies", "Candidate matches"].map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-white/15 bg-slate-950/35 p-4"
                  >
                    <Check className="size-5 text-emerald-300" />
                    <p className="mt-3 text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <form
          className="mx-auto w-full max-w-7xl pb-10"
          onSubmit={handleCreateAccount}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <section
              className="rounded-lg border border-slate-200 bg-surface p-5 shadow-xl shadow-slate-950/5 sm:p-6"
              aria-labelledby="recruiter-information-heading"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary">
                  <UsersRound className="size-5" aria-hidden="true" />
                </span>
                <h2
                  id="recruiter-information-heading"
                  className="font-heading text-xl font-bold text-foreground"
                >
                  Recruiter Information
                </h2>
              </div>

              <div className="mt-6 grid gap-5">
                <TextField
                  id="recruiter-name"
                  label="Full Name"
                  value={recruiterNameValue}
                  onChange={(value) => updateField("recruiterName", value)}
                  error={errors.recruiterName}
                  autoComplete="name"
                  placeholder="Your full name"
                />
                <TextField
                  id="work-email"
                  label="Work Email"
                  type="email"
                  value={workEmailValue}
                  onChange={(value) => updateField("workEmail", value)}
                  error={errors.workEmail}
                  autoComplete="email"
                  placeholder="you@company.com"
                />
                <SelectField
                  id="recruiter-role"
                  label="Your Role"
                  value={formState.recruiterRole}
                  onChange={(value) =>
                    updateField("recruiterRole", value as RecruiterRole)
                  }
                  error={errors.recruiterRole}
                  options={recruiterRoles}
                  placeholder="Select your role"
                />
                <TextField
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={formState.phone}
                  onChange={(value) => updateField("phone", value)}
                  error={errors.phone}
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </section>

            <section
              className="rounded-lg border border-slate-200 bg-surface p-5 shadow-xl shadow-slate-950/5 sm:p-6"
              aria-labelledby="company-details-heading"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <Building2 className="size-5" aria-hidden="true" />
                </span>
                <h2
                  id="company-details-heading"
                  className="font-heading text-xl font-bold text-foreground"
                >
                  Company Details
                </h2>
              </div>

              <div className="mt-6 grid gap-5">
                <div>
                  <span className="block text-sm font-medium text-foreground">
                    Company Logo
                  </span>
                  <div
                    className="mt-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-primary/60 hover:bg-blue-50/40"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      setLogoFile(event.dataTransfer.files.item(0));
                    }}
                  >
                    <input
                      ref={logoInputRef}
                      id="company-logo"
                      name="companyLogo"
                      type="file"
                      accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                      className="sr-only"
                      onChange={(event) =>
                        setLogoFile(event.target.files?.item(0) ?? null)
                      }
                      aria-describedby="company-logo-help company-logo-error"
                    />
                    <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-white text-primary shadow-sm">
                      {formState.logoFile ? (
                        <FileImage className="size-6" aria-hidden="true" />
                      ) : (
                        <UploadCloud className="size-6" aria-hidden="true" />
                      )}
                    </div>
                    <label
                      htmlFor="company-logo"
                      className="mt-4 block cursor-pointer text-sm font-semibold text-foreground"
                    >
                      Drop your logo here or browse files
                    </label>
                    <p id="company-logo-help" className="mt-2 text-sm text-muted">
                      JPG, PNG, SVG up to 2MB
                    </p>
                    {formState.logoFile ? (
                      <p className="mt-4 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700">
                        {formState.logoFile.name}
                      </p>
                    ) : null}
                  </div>
                  <p
                    id="company-logo-error"
                    className="mt-2 min-h-5 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.logoFile}
                  </p>
                </div>

                <TextField
                  id="company-name"
                  label="Company Name"
                  value={formState.companyName}
                  onChange={(value) => updateField("companyName", value)}
                  error={errors.companyName}
                  autoComplete="organization"
                  placeholder="Company Inc."
                />
                <TextField
                  id="company-website"
                  label="Company Website"
                  type="url"
                  value={formState.companyWebsite}
                  onChange={(value) => updateField("companyWebsite", value)}
                  error={errors.companyWebsite}
                  autoComplete="url"
                  placeholder="https://company.com"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField
                    id="industry"
                    label="Industry"
                    value={formState.industry}
                    onChange={(value) => updateField("industry", value as Industry)}
                    error={errors.industry}
                    options={industries}
                    placeholder="Select industry"
                  />
                  <SelectField
                    id="company-size"
                    label="Company Size"
                    value={formState.companySize}
                    onChange={(value) =>
                      updateField("companySize", value as CompanySize)
                    }
                    error={errors.companySize}
                    options={companySizes}
                    placeholder="Select size"
                  />
                </div>
                <TextAreaField
                  id="company-bio"
                  label="Company Bio"
                  value={formState.companyBio}
                  onChange={(value) => updateField("companyBio", value)}
                  error={errors.companyBio}
                  placeholder="Tell candidates what your company builds, who you hire, and why your team is growing."
                />

                <div>
                  <label className="flex items-start gap-3 text-sm leading-6 text-muted">
                    <input
                      type="checkbox"
                      checked={formState.acceptedTerms}
                      onChange={(event) =>
                        updateField("acceptedTerms", event.target.checked)
                      }
                      aria-invalid={Boolean(errors.acceptedTerms)}
                      aria-describedby={
                        errors.acceptedTerms ? "accepted-terms-error" : undefined
                      }
                      className="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                    />
                    <span>
                      I confirm I am authorized to create this employer account
                      and agree to the{" "}
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
                  <p
                    id="accepted-terms-error"
                    className="mt-2 min-h-5 text-sm text-red-600"
                    aria-live="polite"
                  >
                    {errors.acceptedTerms}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {errors.form ? (
            <p
              className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {errors.form}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
            >
              <Mail className="size-4" aria-hidden="true" />
              Contact recruiter support
            </Link>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isSubmitting || isAuthLoading}
                onClick={handleSaveDraft}
                className="flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isSavingDraft ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Saving draft
                  </>
                ) : (
                  "Save Draft"
                )}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isAuthLoading}
                className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isCreatingAccount ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Creating account
                  </>
                ) : (
                  <>
                    Create Employer Account
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <section
          className="mx-auto w-full max-w-7xl border-t border-slate-200 py-8"
          aria-labelledby="trusted-by-heading"
        >
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-primary">
                Trusted by industry leaders
              </p>
              <h2
                id="trusted-by-heading"
                className="mt-2 font-heading text-2xl font-bold text-foreground"
              >
                Hiring teams use CareerBridge to build stronger pipelines.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {trustedCompanies.map((company) => (
                <div
                  key={company}
                  className="flex min-h-20 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-center text-sm font-bold text-slate-700 shadow-sm"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 text-sm text-muted sm:justify-between">
          <div className="flex items-center gap-2 font-heading font-bold text-primary">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
            CareerBridge
          </div>
          <nav aria-label="Employer registration footer">
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

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  placeholder,
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <p
        id={errorId}
        className="mt-2 min-h-5 text-sm text-red-600"
        aria-live="polite"
      >
        {error}
      </p>
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  options: string[];
  placeholder: string;
};

function SelectField({
  id,
  label,
  value,
  onChange,
  error,
  options,
  placeholder,
}: SelectFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <p
        id={errorId}
        className="mt-2 min-h-5 text-sm text-red-600"
        aria-live="polite"
      >
        {error}
      </p>
    </div>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
};

function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
}: TextAreaFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholder={placeholder}
        rows={5}
        className="mt-2 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <p
        id={errorId}
        className="mt-2 min-h-5 text-sm text-red-600"
        aria-live="polite"
      >
        {error}
      </p>
    </div>
  );
}
