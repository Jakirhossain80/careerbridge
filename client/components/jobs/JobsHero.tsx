import { Sparkles } from "lucide-react";

const jobsHeroStats = [
  { label: "Company status", value: "Verified" },
  { label: "Work options", value: "Flexible" },
  { label: "Listings", value: "Current" },
  { label: "Search", value: "Focused" },
];

export default function JobsHero() {
  return (
    <section className="bg-surface px-6 py-14 dark:bg-slate-900 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              Jobs category
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Find roles that match your skills, goals, and work style
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Search across verified openings, compare work modes, and narrow
              opportunities by salary, experience, company, and industry.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {jobsHeroStats.map((stat) => {
              return (
                <div
                  key={stat.label}
                  className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary"><Sparkles className="size-5" aria-hidden="true" /></span>
                    <div>
                      <p className="text-xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
