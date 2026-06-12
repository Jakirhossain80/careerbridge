import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Home,
  LifeBuoy,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Account Pending Approval | CareerBridge",
  description:
    "Your CareerBridge employer account is under review for portal access.",
};

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/help", label: "Help Center" },
  { href: "/contact", label: "Contact Support" },
];

const reviewCards = [
  {
    title: "Business validation",
    description:
      "Our team reviews company details, business contact information, and hiring intent before enabling employer workspace access.",
    icon: Building2,
  },
  {
    title: "Security protocol",
    description:
      "Account permissions remain limited until the employer profile clears identity, access, and platform safety checks.",
    icon: ShieldCheck,
  },
];

const reviewSteps = [
  "Company profile received",
  "Employer verification in progress",
  "Portal access pending approval",
];

export default function AccountPendingPage() {
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
            aria-label="Account pending navigation"
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

        <section
          className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-10 lg:py-12"
          aria-labelledby="account-pending-title"
        >
          <div className="w-full max-w-6xl rounded-lg border border-slate-200 bg-surface p-6 shadow-xl shadow-slate-950/5 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <aside
                className="order-2 rounded-lg border border-slate-200 bg-slate-50 p-5 lg:order-1"
                aria-label="Employer approval status illustration"
              >
                <div className="relative mx-auto flex aspect-[4/3] w-full max-w-md items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
                  <div className="absolute inset-x-7 top-8 h-24 rounded-md border border-slate-200 bg-slate-50 shadow-sm" />
                  <div className="absolute inset-x-11 top-16 h-40 rounded-md border border-slate-200 bg-white shadow-lg" />
                  <div className="absolute left-14 right-14 top-24 space-y-3">
                    <span className="block h-3 rounded-full bg-slate-200" />
                    <span className="block h-3 w-4/5 rounded-full bg-slate-200" />
                    <span className="block h-3 w-3/5 rounded-full bg-slate-200" />
                  </div>
                  <div className="absolute right-12 top-12 flex size-12 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 ring-8 ring-emerald-50/70">
                    <FileCheck2 className="size-6" aria-hidden="true" />
                  </div>
                  <div className="relative flex size-28 items-center justify-center rounded-full bg-blue-50 text-primary ring-8 ring-blue-100/60">
                    <Clock3 className="size-12" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-9 flex w-[78%] items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 shadow-sm">
                    <LockKeyhole
                      className="size-5 flex-none"
                      aria-hidden="true"
                    />
                    <span className="h-2 flex-1 rounded-full bg-amber-200" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {reviewSteps.map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3"
                    >
                      <span
                        className={`flex size-8 flex-none items-center justify-center rounded-full ${
                          index === reviewSteps.length - 1
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {index === reviewSteps.length - 1 ? (
                          <Clock3 className="size-4" aria-hidden="true" />
                        ) : (
                          <CheckCircle2 className="size-4" aria-hidden="true" />
                        )}
                      </span>
                      <p className="text-sm font-medium text-slate-700">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </aside>

              <div className="order-1 text-center lg:order-2 lg:text-left">
                <div className="mx-auto inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 lg:mx-0">
                  <Clock3 className="size-4" aria-hidden="true" />
                  Verification pending
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold uppercase text-primary">
                    Account Pending Approval
                  </p>
                  <h1
                    id="account-pending-title"
                    className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl"
                  >
                    Securing Your Employer Portal
                  </h1>
                  <p className="mt-4 text-sm leading-6 text-muted sm:text-base sm:leading-7">
                    Your employer account is under review. CareerBridge checks
                    every employer workspace before opening portal access so
                    candidates and hiring teams can work in a trusted
                    environment.
                  </p>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {reviewCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <article
                        key={card.title}
                        className="rounded-md border border-slate-200 bg-slate-50 p-4 text-left"
                      >
                        <span className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <h2 className="mt-4 text-sm font-semibold text-slate-950">
                          {card.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {card.description}
                        </p>
                      </article>
                    );
                  })}
                </div>

                <div
                  className="mt-5 rounded-md border border-blue-200 bg-blue-50 p-4 text-left"
                  role="status"
                >
                  <div className="flex gap-3">
                    <Clock3
                      className="mt-0.5 size-5 flex-none text-primary"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-6 text-slate-700">
                      Approval usually takes 24-48 business hours. We will email
                      you as soon as your employer portal is ready.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <LifeBuoy className="size-4" aria-hidden="true" />
                    Contact Support
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <Home className="size-4" aria-hidden="true" />
                    Return Home
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>

                <div
                  className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
                  aria-label="CareerBridge trust indicators"
                >
                  <span className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                    <BadgeCheck className="size-4" aria-hidden="true" />
                    ISO Certified
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Data Secured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 text-sm text-muted sm:justify-between">
          <p>Copyright 2026 CareerBridge</p>
          <nav aria-label="Account pending footer">
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

// TODO: When user profile status values are available, redirect employer
// accounts with statuses like pending, active, blocked, rejected, or suspended
// to the appropriate system route from the auth guard or post-login flow.
