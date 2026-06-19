import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { whyChooseReasons } from "@/lib/about-data";

import SectionHeader from "@/components/home/SectionHeader";

export default function WhyChooseCareerBridge() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <SectionHeader
            eyebrow="Why choose CareerBridge"
            title="A clearer path from search to shortlist"
            description="The platform is designed to help candidates and companies spend less time guessing and more time making informed decisions."
          />
          <Link
            href="/jobs"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-base font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            Start exploring
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="space-y-4">
          {whyChooseReasons.map((reason) => (
            <article
              key={reason.title}
              className="rounded-lg border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700"
            >
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary dark:bg-blue-950">
                  <Sparkles className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {reason.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
