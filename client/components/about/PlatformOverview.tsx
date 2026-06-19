import { CheckCircle2, UsersRound } from "lucide-react";

import { platformAudiences } from "@/lib/about-data";

import SectionHeader from "@/components/home/SectionHeader";

export default function PlatformOverview() {
  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Platform overview"
          title="Purpose-built for job seekers and employers"
          description="CareerBridge keeps both sides of hiring aligned through clear profiles, detailed roles, and practical matching signals."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {platformAudiences.map((audience) => (
            <article
              key={audience.title}
              className="rounded-lg border border-slate-200 bg-background p-6 shadow-sm dark:border-slate-700 md:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950">
                  <UsersRound className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {audience.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {audience.description}
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {audience.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-6 text-muted"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
