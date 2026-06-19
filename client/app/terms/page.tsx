import type { Metadata } from "next";
import { CalendarDays, Scale } from "lucide-react";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import TermsActions from "@/components/terms/TermsActions";
import TermsContent from "@/components/terms/TermsContent";
import TermsHelpCard from "@/components/terms/TermsHelpCard";
import TermsSidebar from "@/components/terms/TermsSidebar";
import { termsIntro, termsLastUpdated } from "@/lib/terms-data";

export const metadata: Metadata = {
  title: "Terms and Conditions | CareerBridge",
  description:
    "Review the CareerBridge Terms and Conditions for job seekers, employers, recruiters, and platform visitors.",
};

export default function TermsPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <section className="relative overflow-hidden bg-surface">
          <div className="absolute inset-x-0 top-0 h-64 bg-blue-50 dark:bg-blue-950/30" />
          <div className="relative mx-auto w-full max-w-6xl px-6 py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm dark:border-blue-900 dark:bg-slate-900">
                <Scale className="size-4" aria-hidden="true" />
                {termsIntro.eyebrow}
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {termsIntro.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                {termsIntro.description}
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <CalendarDays className="size-5 text-accent" aria-hidden="true" />
                <span>Last updated: {termsLastUpdated}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:py-14">
          <div className="space-y-5 lg:sticky lg:top-24">
            <TermsSidebar />
            <TermsHelpCard />
          </div>

          <div className="space-y-6">
            <TermsContent />
            <TermsActions />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
