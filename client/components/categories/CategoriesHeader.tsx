import { BriefcaseBusiness, Layers3, Sparkles } from "lucide-react";

const stats = [
  {
    label: "Active categories",
    value: "12",
    icon: Layers3,
  },
  {
    label: "Available jobs",
    value: "6.3K+",
    icon: BriefcaseBusiness,
  },
  {
    label: "Featured tracks",
    value: "3",
    icon: Sparkles,
  },
];

export default function CategoriesHeader() {
  return (
    <section className="bg-surface px-6 py-14 dark:bg-slate-900 sm:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Job categories
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Browse career paths built around the way teams hire
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Explore popular fields, compare open roles, and jump into filtered
            job listings by the category that best matches your skills.
          </p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <dt className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary dark:bg-blue-950">
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="sr-only">{stat.label}</span>
                  </dt>
                  <dd>
                    <p className="text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted">{stat.label}</p>
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
