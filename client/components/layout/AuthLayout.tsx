import type { ReactNode } from "react";
import Link from "next/link";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <section className="hidden bg-primary px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="font-heading text-2xl font-bold">
          CareerBridge
        </Link>

        <div className="max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-100">
            Career growth starts here
          </p>
          <h1 className="text-4xl font-bold leading-tight">
            Connect your skills with the right opportunity.
          </h1>
          <p className="mt-5 text-lg leading-8 text-blue-100">
            Build a profile, explore career paths, and move confidently toward
            meaningful work.
          </p>
        </div>

        <p className="text-sm text-blue-100">
          Trusted tools for students, job seekers, and growing teams.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
              className="font-heading text-2xl font-bold text-primary"
            >
              CareerBridge
            </Link>
          </div>

          <div className="app-surface rounded-lg border border-slate-200 p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
