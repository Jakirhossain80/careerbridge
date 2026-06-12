import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  Home,
  LockKeyhole,
  Mail,
  Search,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "403 Access Denied | CareerBridge",
  description:
    "You do not have permission to access this CareerBridge workspace.",
};

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/help", label: "Help Center" },
  { href: "/contact", label: "Contact Support" },
];

const quickLinks = [
  {
    href: "/jobs",
    title: "Browse Jobs",
    description: "Explore open roles that match your goals and skills.",
    icon: Search,
  },
  {
    href: "/help",
    title: "Knowledge Base",
    description: "Find account, access, and workspace guidance.",
    icon: BookOpenText,
  },
];

export default function UnauthorizedPage() {
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
            aria-label="Unauthorized page navigation"
            className="flex items-center gap-4 text-sm"
          >
            <Link
              href="/login"
              className="font-medium text-muted transition hover:text-primary"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="font-semibold text-primary transition hover:text-blue-700"
            >
              Join Now
            </Link>
          </nav>
        </header>

        <section
          className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-10 lg:py-12"
          aria-labelledby="unauthorized-title"
        >
          <div className="w-full max-w-5xl rounded-lg border border-slate-200 bg-surface p-6 shadow-xl shadow-slate-950/5 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="text-center lg:text-left">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-blue-50 text-primary ring-8 ring-blue-50/60 lg:mx-0">
                  <LockKeyhole className="size-10" aria-hidden="true" />
                </div>

                <div className="mt-7">
                  <p className="text-sm font-semibold uppercase text-primary">
                    Protected workspace
                  </p>
                  <h1
                    id="unauthorized-title"
                    className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl"
                  >
                    403 - Access Denied
                  </h1>
                  <p className="mt-4 text-sm leading-6 text-muted sm:text-base sm:leading-7">
                    You do not have permission to view this CareerBridge area.
                    Your account may need a different role, approval, or an
                    updated invitation before this page becomes available.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <Home className="size-4" aria-hidden="true" />
                    Go Back Home
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    Contact Support
                  </Link>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  Secure Career Environment
                </div>
              </div>

              <aside
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                aria-label="Access denied illustration"
              >
                <div className="relative mx-auto flex aspect-[4/3] w-full max-w-md items-center justify-center overflow-hidden rounded-md bg-white">
                  <div className="absolute inset-x-8 top-8 h-24 rounded-md border border-slate-200 bg-slate-50 shadow-sm" />
                  <div className="absolute left-8 right-8 top-20 h-36 rounded-md border border-slate-200 bg-white shadow-md" />
                  <div className="absolute top-11 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-400" />
                    <span className="size-2 rounded-full bg-amber-400" />
                    <span className="size-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="relative flex size-28 items-center justify-center rounded-full bg-blue-50 text-primary ring-8 ring-blue-100/60">
                    <LockKeyhole className="size-12" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-10 grid w-[78%] gap-3">
                    <span className="h-3 rounded-full bg-slate-200" />
                    <span className="h-3 w-2/3 rounded-full bg-slate-200" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {quickLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group rounded-md border border-slate-200 bg-white p-4 text-left transition hover:border-primary/50 hover:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <span className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary transition group-hover:bg-primary group-hover:text-white">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-slate-950">
                          {item.title}
                          <ArrowRight className="size-4 text-slate-400 transition group-hover:text-primary" />
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-muted">
                          {item.description}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-slate-200 pt-5 text-sm text-muted sm:justify-between">
          <p>Copyright 2026 CareerBridge</p>
          <nav aria-label="Unauthorized page footer">
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

// TODO: Point future role-based authorization guards to /unauthorized when
// account roles and permission checks are added.
