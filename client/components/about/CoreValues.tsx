import { ShieldCheck } from "lucide-react";

import { coreValues } from "@/lib/about-data";

import SectionHeader from "@/components/home/SectionHeader";

export default function CoreValues() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          align="center"
          eyebrow="Core values"
          title="The principles behind CareerBridge"
          description="Our values guide how we design hiring workflows, candidate experiences, and employer tools."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value) => (
            <article
              key={value.title}
              className="rounded-lg border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700"
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-accent dark:bg-emerald-950">
                <ShieldCheck className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
