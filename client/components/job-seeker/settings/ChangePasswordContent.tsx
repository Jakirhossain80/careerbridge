"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import SecurityBannerCard from "@/components/settings/SecurityBannerCard";
import SecurityTipsCard from "@/components/settings/SecurityTipsCard";

export default function ChangePasswordContent() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
          <nav
            className="flex flex-wrap items-center gap-2 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href="/job-seeker/settings"
              className="font-medium text-muted transition hover:text-primary"
            >
              Settings
            </Link>
            <ChevronRight className="size-4 text-muted" aria-hidden="true" />
            <span className="font-semibold text-foreground">Change Password</span>
          </nav>
          <div className="mt-4 max-w-3xl">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Change Password
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Update your security credentials for your CareerBridge job seeker account.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <ChangePasswordForm cancelHref="/job-seeker/settings" />
          <aside className="space-y-6">
            <SecurityTipsCard />
            <SecurityBannerCard />
          </aside>
        </div>
      </div>
    </main>
  );
}
