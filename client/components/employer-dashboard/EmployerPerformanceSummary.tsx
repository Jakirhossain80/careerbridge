import type { PerformancePoint } from "@/lib/employer-dashboard-data";

type EmployerPerformanceSummaryProps = {
  data: PerformancePoint[];
};

export default function EmployerPerformanceSummary({
  data,
}: EmployerPerformanceSummaryProps) {
  const maxValue = Math.max(...data.map((item) => item.views), 1);

  return (
    <section
      aria-labelledby="performance-summary-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h2
            id="performance-summary-heading"
            className="text-lg font-semibold text-foreground"
          >
            Performance Summary
          </h2>
          <p className="mt-1 text-sm text-muted">
            Monthly applicant and job view activity.
          </p>
        </div>
        <dl className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <dt className="flex items-center gap-2 text-muted">
              <span className="size-2 rounded-full bg-primary" />
              Applicants
            </dt>
          </div>
          <div className="flex items-center gap-2">
            <dt className="flex items-center gap-2 text-muted">
              <span className="size-2 rounded-full bg-accent" />
              Views
            </dt>
          </div>
        </dl>
      </div>

      <div className="mt-6 h-72 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
        <div className="flex h-full items-end gap-3" aria-hidden="true">
          {data.map((item) => {
            const applicantHeight = `${Math.max((item.applicants / maxValue) * 100, 8)}%`;
            const viewsHeight = `${Math.max((item.views / maxValue) * 100, 12)}%`;

            return (
              <div
                key={item.label}
                className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"
              >
                <div className="flex flex-1 items-end justify-center gap-1.5">
                  <span
                    className="w-full max-w-5 rounded-t-md bg-primary"
                    style={{ height: applicantHeight }}
                  />
                  <span
                    className="w-full max-w-5 rounded-t-md bg-accent"
                    style={{ height: viewsHeight }}
                  />
                </div>
                <span className="truncate text-center text-xs font-medium text-muted">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <table className="sr-only">
        <caption>Performance summary by month</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Applicants</th>
            <th scope="col">Views</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.label}>
              <th scope="row">{item.label}</th>
              <td>{item.applicants}</td>
              <td>{item.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
