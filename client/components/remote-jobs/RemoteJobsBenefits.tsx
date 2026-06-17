import { remoteBenefits } from "@/lib/remote-jobs-data";

export default function RemoteJobsBenefits() {
  return (
    <section className="bg-surface px-6 py-16 dark:bg-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Why choose remote
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Remote work with structure, clarity, and real flexibility
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            CareerBridge highlights roles with transparent expectations so you
            can compare remote opportunities before starting the hiring process.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {remoteBenefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="rounded-lg border border-slate-200 bg-background p-5 shadow-sm dark:border-slate-700"
              >
                <div className="flex size-11 items-center justify-center rounded-md bg-blue-50 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
