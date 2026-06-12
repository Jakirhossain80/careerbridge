import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Ban,
  BriefcaseBusiness,
  FileText,
  Home,
  LifeBuoy,
  LockKeyhole,
  LogIn,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Account Blocked | CareerBridge",
  description:
    "Your CareerBridge account access is currently restricted. Contact support for help.",
};

const footerLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/help", label: "Help Center" },
  { href: "/contact", label: "Contact Support" },
];

const restrictionDetails = [
  {
    title: "Platform access paused",
    description:
      "Applications, employer tools, saved jobs, messages, and dashboard features are unavailable while this restriction is active.",
    icon: LockKeyhole,
  },
  {
    title: "Support review required",
    description:
      "Our team can review the account status, explain next steps, and help resolve eligible access issues.",
    icon: LifeBuoy,
  },
];

export default function AccountBlockedPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 top-0 h-40 border-b border-slate-200 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute left-0 top-28 h-48 w-28 border-y border-r border-red-100 bg-red-50/60" />
        <div className="absolute bottom-20 right-0 h-56 w-32 border-y border-l border-blue-100 bg-blue-50/60" />
      </div>

      <div className="relative flex min-h-screen flex-col px-5 py-5 sm:px-8 lg:px-10">
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
            aria-label="Account blocked navigation"
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
              className="inline-flex items-center gap-2 font-semibold text-primary transition hover:text-blue-700"
            >
              <LogIn className="size-4" aria-hidden="true" />
              Sign In
            </Link>
          </nav>
        </header>

        <section
          className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-10 lg:py-12"
          aria-labelledby="account-blocked-title"
        >
          <div className="w-full max-w-5xl rounded-lg border border-slate-200 bg-surface p-6 shadow-xl shadow-slate-950/5 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="text-center lg:text-left">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-50 text-red-700 ring-8 ring-red-50/70 lg:mx-0">
                  <Ban className="size-10" aria-hidden="true" />
                </div>

                <div className="mt-7">
                  <p className="text-sm font-semibold uppercase text-red-700">
                    Account Restricted
                  </p>
                  <h1
                    id="account-blocked-title"
                    className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl"
                  >
                    Access Restricted
                  </h1>
                  <p className="mt-4 text-sm leading-6 text-muted sm:text-base sm:leading-7">
                    Your CareerBridge account has been suspended or restricted
                    after a platform review. For security and compliance,
                    account features remain unavailable until the restriction is
                    reviewed or lifted.
                  </p>
                </div>

                <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-left">
                  <div className="flex gap-3">
                    <ShieldAlert
                      className="mt-0.5 size-5 flex-none text-red-700"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-6 text-red-800">
                      You cannot access applications, job activity, employer
                      workspaces, profile tools, or messaging while this account
                      status is active.
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
                    Back to Home
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>

                <div
                  className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm lg:justify-start"
                  aria-label="Account blocked legal links"
                >
                  <Link
                    href="/privacy-policy"
                    className="font-medium text-muted transition hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="font-medium text-muted transition hover:text-primary"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>

              <aside
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                aria-label="Account restriction details"
              >
                <div className="relative mx-auto flex aspect-[4/3] w-full max-w-md items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
                  <div className="absolute inset-x-8 top-8 h-24 rounded-md border border-slate-200 bg-slate-50 shadow-sm" />
                  <div className="absolute left-10 right-10 top-18 h-36 rounded-md border border-slate-200 bg-white shadow-md" />
                  <div className="absolute left-14 right-14 top-28 space-y-3">
                    <span className="block h-3 rounded-full bg-slate-200" />
                    <span className="block h-3 w-4/5 rounded-full bg-slate-200" />
                    <span className="block h-3 w-2/3 rounded-full bg-slate-200" />
                  </div>
                  <div className="absolute right-12 top-12 flex size-12 items-center justify-center rounded-md bg-red-50 text-red-700 ring-8 ring-red-50/70">
                    <ShieldAlert className="size-6" aria-hidden="true" />
                  </div>
                  <div className="relative flex size-28 items-center justify-center rounded-full bg-red-50 text-red-700 ring-8 ring-red-100/70">
                    <Ban className="size-12" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-9 flex w-[78%] items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800 shadow-sm">
                    <LockKeyhole
                      className="size-5 flex-none"
                      aria-hidden="true"
                    />
                    <span className="h-2 flex-1 rounded-full bg-red-200" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {restrictionDetails.map((item) => {
                    const Icon = item.icon;

                    return (
                      <article
                        key={item.title}
                        className="rounded-md border border-slate-200 bg-white p-4"
                      >
                        <div className="flex gap-3">
                          <span className="flex size-10 flex-none items-center justify-center rounded-md bg-blue-50 text-primary">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <div>
                            <h2 className="text-sm font-semibold text-slate-950">
                              {item.title}
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-muted">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <section
                  className="mt-5 rounded-md border border-slate-200 bg-white p-4"
                  aria-labelledby="reference-id-title"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 flex-none items-center justify-center rounded-md bg-slate-100 text-slate-700">
                      <FileText className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2
                        id="reference-id-title"
                        className="text-sm font-semibold text-slate-950"
                      >
                        Reference ID
                      </h2>
                      <p className="mt-1 font-mono text-sm font-semibold text-slate-700">
                        CB-ACCESS-RESTRICTED
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        Include this reference when contacting support so the
                        team can route your request correctly.
                      </p>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 text-sm text-muted sm:justify-between">
          <p>Copyright 2026 CareerBridge</p>
          <nav aria-label="Account blocked footer">
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

// TODO: When profile status data is available, redirect users with statuses
// such as blocked, suspended, rejected, pending, or active from the auth guard
// or post-login flow to the appropriate system route, including /account-blocked.
