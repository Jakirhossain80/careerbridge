import { FileText } from "lucide-react";

import TermsSection from "@/components/terms/TermsSection";
import { termsSections } from "@/lib/terms-data";

export default function TermsContent() {
  return (
    <article
      aria-labelledby="terms-content-heading"
      className="overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              CareerBridge legal agreement
            </p>
            <h2
              id="terms-content-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-foreground"
            >
              Main legal content
            </h2>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-accent dark:bg-emerald-950/40">
            <FileText className="size-6" aria-hidden="true" />
          </div>
        </div>
      </div>

      {termsSections.map((section, index) => (
        <TermsSection key={section.id} section={section} index={index} />
      ))}
    </article>
  );
}
