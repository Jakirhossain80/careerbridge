import { BookOpen, TrendingUp, UsersRound } from "lucide-react";

const heroStats = [
  { label: "Career guides", value: "120+", icon: BookOpen },
  { label: "Monthly readers", value: "85K+", icon: UsersRound },
  { label: "Hiring insights", value: "Weekly", icon: TrendingUp },
];

export default function BlogHero() {
  return (
    <section className="bg-surface px-6 py-14 dark:bg-slate-900 sm:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            CareerBridge blog
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Practical career advice for every step of your journey
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Explore expert guidance on job searching, resumes, interviews,
            remote work, hiring signals, and workplace growth.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {heroStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary dark:bg-blue-950">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
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
    </section>
  );
}
