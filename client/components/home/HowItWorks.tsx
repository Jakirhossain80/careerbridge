import { CheckCircle2 } from "lucide-react";

import { workSteps } from "@/lib/home-data";

import SectionHeader from "./SectionHeader";

export default function HowItWorks() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          align="center"
          eyebrow="How it works"
          title="A simpler way to move from search to offer"
          description="CareerBridge keeps the process practical: build a profile, find matched roles, and apply with the context employers need."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {workSteps.map((step, index) => (
            <article
              key={step.title}
              className="relative rounded-lg border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700"
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
