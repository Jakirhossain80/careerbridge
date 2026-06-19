import { CheckCircle2 } from "lucide-react";

import { aboutWorkSteps } from "@/lib/about-data";

import SectionHeader from "@/components/home/SectionHeader";

export default function HowCareerBridgeWorks() {
  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          align="center"
          eyebrow="How CareerBridge works"
          title="Simple steps for a better hiring match"
          description="The workflow keeps the path practical for candidates and efficient for employers."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {aboutWorkSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-lg border border-slate-200 bg-background p-6 shadow-sm dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-accent dark:bg-emerald-950">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-primary">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
