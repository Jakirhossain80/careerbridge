import { Globe2, ImageIcon, Search, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui";
import { remoteHeroStats, remoteWorkBadges } from "@/lib/remote-jobs-data";

export default function RemoteJobsHero() {
  return (
    <section className="bg-surface px-6 py-14 dark:bg-slate-900 sm:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <Badge variant="primary" className="gap-2 uppercase tracking-wide">
            <Globe2 className="size-3.5" aria-hidden="true" />
            Remote work
          </Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Find remote jobs built for how modern teams work
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Explore verified remote roles with clear timezone expectations,
            flexible work styles, salary ranges, and remote-first hiring teams.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {remoteWorkBadges.map((badge) => (
              <Badge key={badge} variant="neutral">
                {badge}
              </Badge>
            ))}
          </div>

          <form
            role="search"
            aria-label="Search remote jobs"
            className="mt-8 rounded-lg border border-slate-200 bg-background p-3 shadow-sm dark:border-slate-700"
          >
            <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_auto]">
              <label className="relative block">
                <span className="sr-only">Job title or keyword</span>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="keyword"
                  placeholder="Job title or keyword"
                  className="h-12 w-full rounded-md border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Timezone</span>
                <Globe2
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="timezone"
                  placeholder="Timezone"
                  className="h-12 w-full rounded-md border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-lg border border-slate-200 bg-background p-5 shadow-sm dark:border-slate-700">
          <div className="relative overflow-hidden rounded-md bg-blue-50 p-5 dark:bg-blue-950/30">
            <div className="absolute right-4 top-4 flex size-12 items-center justify-center rounded-md bg-white text-primary shadow-sm dark:bg-slate-900">
              <ImageIcon className="size-6" aria-hidden="true" />
            </div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              Remote teams hiring now
            </p>
            <div className="mt-16 grid gap-3">
              {remoteHeroStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-md bg-white/90 p-4 shadow-sm dark:bg-slate-900/90"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-sm text-muted">{stat.label}</span>
                    </span>
                    <strong className="text-lg text-foreground">
                      {stat.value}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
