"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileText,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { appToast } from "@/lib/toast";

type JobType = "Full-time" | "Remote" | "Contract" | "Hybrid";

type ProfileFormState = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  skills: string;
  jobTypes: JobType[];
  resume: File | null;
};

type ProfileFormErrors = Partial<
  Record<
    | "fullName"
    | "email"
    | "phone"
    | "location"
    | "jobTitle"
    | "skills"
    | "jobTypes"
    | "resume"
    | "form",
    string
  >
>;

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/help", label: "Help Center" },
  { href: "/support", label: "Contact Support" },
];

const profileSteps = ["Personal", "Professional", "Resume"];

const preferredJobTypes: JobType[] = [
  "Full-time",
  "Remote",
  "Contract",
  "Hybrid",
];

const emptyFormState: ProfileFormState = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  jobTitle: "",
  skills: "",
  jobTypes: [],
  resume: null,
};

const maxResumeSize = 10 * 1024 * 1024;

export default function JobSeekerProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formState, setFormState] = useState<ProfileFormState>(emptyFormState);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isCompletingRegistration, setIsCompletingRegistration] =
    useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        return;
      }

      setFormState((currentFormState) => ({
        ...currentFormState,
        fullName: currentFormState.fullName || currentUser.displayName || "",
        email: currentFormState.email || currentUser.email || "",
      }));
    });

    return unsubscribe;
  }, []);

  const updateField = (
    field: keyof Omit<ProfileFormState, "jobTypes" | "resume">,
    value: string
  ) => {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  };

  const toggleJobType = (jobType: JobType) => {
    setFormState((currentFormState) => {
      const hasJobType = currentFormState.jobTypes.includes(jobType);

      return {
        ...currentFormState,
        jobTypes: hasJobType
          ? currentFormState.jobTypes.filter((type) => type !== jobType)
          : [...currentFormState.jobTypes, jobType],
      };
    });
  };

  const validateResume = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const hasAllowedExtension = /\.(pdf|docx)$/i.test(file.name);

    if (!allowedTypes.includes(file.type) && !hasAllowedExtension) {
      return "Upload a PDF or DOCX file.";
    }

    if (file.size > maxResumeSize) {
      return "Resume must be 10MB or smaller.";
    }

    return undefined;
  };

  const setResumeFile = (file: File | null) => {
    if (!file) {
      setFormState((currentFormState) => ({
        ...currentFormState,
        resume: null,
      }));
      return;
    }

    const resumeError = validateResume(file);

    setErrors((currentErrors) => ({
      ...currentErrors,
      resume: resumeError,
    }));

    if (!resumeError) {
      setFormState((currentFormState) => ({
        ...currentFormState,
        resume: file,
      }));
    }
  };

  const validateForm = ({ requireResume }: { requireResume: boolean }) => {
    const nextErrors: ProfileFormErrors = {};
    const trimmedEmail = formState.email.trim();

    if (!formState.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formState.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    if (!formState.location.trim()) {
      nextErrors.location = "Location is required.";
    }

    if (!formState.jobTitle.trim()) {
      nextErrors.jobTitle = "Current or target job title is required.";
    }

    if (!formState.skills.trim()) {
      nextErrors.skills = "Key skills are required.";
    }

    if (formState.jobTypes.length === 0) {
      nextErrors.jobTypes = "Select at least one preferred job type.";
    }

    if (formState.resume) {
      const resumeError = validateResume(formState.resume);

      if (resumeError) {
        nextErrors.resume = resumeError;
      }
    } else if (requireResume) {
      nextErrors.resume = "Upload your resume to complete registration.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setErrors({});

    try {
      // TODO: Persist this draft when a job seeker profile draft API is added.
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

  const handleCompleteRegistration = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm({ requireResume: true })) {
      return;
    }

    setIsCompletingRegistration(true);
    setErrors({});

    try {
      // TODO: Submit this profile when the job seeker profile API is added.
      await Promise.resolve();
      appToast.success("Registration completed successfully.");
      router.push("/dashboard");
    } catch {
      const message = "We could not complete your registration. Please try again.";
      setErrors({
        form: message,
      });
      appToast.error(message);
    } finally {
      setIsCompletingRegistration(false);
    }
  };

  const isSubmitting = isSavingDraft || isCompletingRegistration;

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
            aria-label="Profile registration navigation"
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

        <section className="mx-auto grid w-full max-w-7xl flex-1 gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-12">
          <aside className="hidden min-h-[760px] overflow-hidden rounded-lg bg-slate-950 text-white shadow-xl shadow-slate-950/10 lg:block">
            <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.32),transparent_36%),linear-gradient(135deg,#0f172a_0%,#1e3a8a_54%,#2563eb_100%)] p-8">
              <div>
                <p className="text-sm font-semibold uppercase text-emerald-200">
                  Job seeker onboarding
                </p>
                <h2 className="mt-4 max-w-md font-heading text-4xl font-bold leading-tight">
                  Build a profile that helps the right jobs find you.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-6 text-blue-100">
                  Add your essentials, highlight skills, and upload a resume so
                  CareerBridge can personalize your search experience.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-blue-100">Profile readiness</p>
                      <p className="mt-2 text-3xl font-bold">3 steps</p>
                    </div>
                    <FileText className="size-10 text-emerald-200" />
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-white/15">
                    <div className="h-2 w-2/3 rounded-full bg-emerald-300" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {["Personal details", "Skills summary"].map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-white/15 bg-slate-950/25 p-4"
                    >
                      <Check className="size-5 text-emerald-300" />
                      <p className="mt-3 text-sm font-semibold">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-lg border border-slate-200 bg-surface p-5 shadow-xl shadow-slate-950/5 sm:p-8">
            <ol
              className="grid grid-cols-3 gap-2"
              aria-label="Profile completion progress"
            >
              {profileSteps.map((step, index) => (
                <li key={step} className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 flex-none items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="truncate text-sm font-semibold text-foreground">
                      {step}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-primary" />
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase text-primary">
                Job seeker profile
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                Create your profile
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Let&apos;s start with your basic information to personalize your
                job search.
              </p>
            </div>

            <form className="mt-8 space-y-8" onSubmit={handleCompleteRegistration}>
              <section aria-labelledby="personal-information-heading">
                <h2
                  id="personal-information-heading"
                  className="font-heading text-xl font-bold text-foreground"
                >
                  Personal Information
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <TextField
                    id="full-name"
                    label="Full Name"
                    value={formState.fullName}
                    onChange={(value) => updateField("fullName", value)}
                    error={errors.fullName}
                    autoComplete="name"
                    placeholder="Your full name"
                  />
                  <TextField
                    id="email"
                    label="Email Address"
                    type="email"
                    value={formState.email}
                    onChange={(value) => updateField("email", value)}
                    error={errors.email}
                    autoComplete="email"
                    placeholder="you@example.com"
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
                  <TextField
                    id="location"
                    label="Location"
                    value={formState.location}
                    onChange={(value) => updateField("location", value)}
                    error={errors.location}
                    autoComplete="address-level2"
                    placeholder="City, state"
                  />
                </div>
              </section>

              <section aria-labelledby="professional-details-heading">
                <h2
                  id="professional-details-heading"
                  className="font-heading text-xl font-bold text-foreground"
                >
                  Professional Details
                </h2>
                <div className="mt-5 grid gap-5">
                  <TextField
                    id="job-title"
                    label="Current/Target Job Title"
                    value={formState.jobTitle}
                    onChange={(value) => updateField("jobTitle", value)}
                    error={errors.jobTitle}
                    placeholder="Product Designer"
                  />
                  <TextField
                    id="skills"
                    label="Key Skills"
                    value={formState.skills}
                    onChange={(value) => updateField("skills", value)}
                    error={errors.skills}
                    placeholder="React, UX research, Figma"
                  />

                  <fieldset>
                    <legend className="text-sm font-medium text-foreground">
                      Preferred Job Type
                    </legend>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {preferredJobTypes.map((jobType) => {
                        const isSelected = formState.jobTypes.includes(jobType);

                        return (
                          <label
                            key={jobType}
                            className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-semibold transition ${
                              isSelected
                                ? "border-primary bg-blue-50 text-primary ring-2 ring-primary/20"
                                : "border-slate-200 bg-white text-slate-700 hover:border-primary/60"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleJobType(jobType)}
                              className="size-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                            />
                            {jobType}
                          </label>
                        );
                      })}
                    </div>
                    <p
                      id="job-types-error"
                      className="mt-2 min-h-5 text-sm text-red-600"
                      aria-live="polite"
                    >
                      {errors.jobTypes}
                    </p>
                  </fieldset>
                </div>
              </section>

              <section aria-labelledby="resume-upload-heading">
                <h2
                  id="resume-upload-heading"
                  className="font-heading text-xl font-bold text-foreground"
                >
                  Resume Upload
                </h2>
                <div
                  className="mt-5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-primary/60 hover:bg-blue-50/40"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    setResumeFile(event.dataTransfer.files.item(0));
                  }}
                >
                  <input
                    ref={fileInputRef}
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(event) =>
                      setResumeFile(event.target.files?.item(0) ?? null)
                    }
                    aria-describedby="resume-help resume-error"
                  />
                  <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-white text-primary shadow-sm">
                    <UploadCloud className="size-6" aria-hidden="true" />
                  </div>
                  <label
                    htmlFor="resume"
                    className="mt-4 block cursor-pointer text-sm font-semibold text-foreground"
                  >
                    Drop your resume here or browse files
                  </label>
                  <p id="resume-help" className="mt-2 text-sm text-muted">
                    PDF, DOCX up to 10MB
                  </p>
                  {formState.resume ? (
                    <p className="mt-4 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700">
                      {formState.resume.name}
                    </p>
                  ) : null}
                </div>
                <p
                  id="resume-error"
                  className="mt-2 min-h-5 text-sm text-red-600"
                  aria-live="polite"
                >
                  {errors.resume}
                </p>
              </section>

              {errors.form ? (
                <p
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {errors.form}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-75"
                >
                  {isCompletingRegistration ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Completing registration
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 text-sm text-muted sm:justify-between">
          <p>Copyright 2026 CareerBridge</p>
          <nav aria-label="Profile registration footer">
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
