import { Badge } from "@/components/ui";
import type { RecentApplication } from "@/lib/employer-dashboard-data";

type RecentApplicationsTableProps = {
  applications: RecentApplication[];
};

const statusVariant = {
  New: "primary",
  Reviewed: "neutral",
  Shortlisted: "success",
  Interview: "warning",
} as const;

export default function RecentApplicationsTable({
  applications,
}: RecentApplicationsTableProps) {
  return (
    <section
      aria-labelledby="recent-applications-heading"
      className="rounded-lg border border-slate-200 bg-surface shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
        <h2
          id="recent-applications-heading"
          className="text-lg font-semibold text-foreground"
        >
          Recent Applications
        </h2>
        <p className="mt-1 text-sm text-muted">
          Latest candidates who applied to your open roles.
        </p>
      </div>

      <div
        className="overflow-x-auto overscroll-x-contain"
        tabIndex={0}
        aria-label="Recent applications table"
      >
        <table className="min-w-full w-max divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted"
              >
                Candidate
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted"
              >
                Applied
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {applications.map((application) => (
              <tr
                key={application.id}
                className="transition hover:bg-blue-50/50 dark:hover:bg-slate-800"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-foreground"
                >
                  {application.candidateName}
                </th>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
                  {application.role}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
                  {application.appliedAt}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm">
                  <Badge variant={statusVariant[application.status]}>
                    {application.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
