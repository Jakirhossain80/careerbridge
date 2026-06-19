import { ShieldCheck } from "lucide-react";

import PrivacySection from "@/components/privacy/PrivacySection";
import { privacySections } from "@/lib/privacy-data";

export default function PrivacyContent() {
  return (
    <article
      aria-labelledby="privacy-content-heading"
      className="overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              CareerBridge privacy practices
            </p>
            <h2
              id="privacy-content-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-foreground"
            >
              Main privacy content
            </h2>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-accent dark:bg-emerald-950/40">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>
        </div>
      </div>

      {privacySections.map((section, index) => (
        <PrivacySection key={section.id} section={section} index={index} />
      ))}
    </article>
  );
}
