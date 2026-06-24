import DashboardMetricCard from "@/components/job-seeker/dashboard/DashboardMetricCard";
import type { JobSeekerInterviewsMeta } from "@/types/interview.types";

type JobSeekerInterviewStatsProps = {
  meta?: JobSeekerInterviewsMeta;
};

export default function JobSeekerInterviewStats({
  meta,
}: JobSeekerInterviewStatsProps) {
  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Interview summary"
    >
      <DashboardMetricCard
        label="Upcoming"
        value={meta?.upcoming ?? 0}
        helperText="Scheduled meetings ahead"
        tone="primary"
        icon="interviews"
      />
      <DashboardMetricCard
        label="Completed"
        value={meta?.completed ?? 0}
        helperText="Finished interview rounds"
        tone="secondary"
        icon="active"
      />
      <DashboardMetricCard
        label="Success Rate"
        value={`${meta?.successRate ?? 0}%`}
        helperText="Completed from closed interviews"
        tone="tertiary"
        icon="recommended"
      />
      <DashboardMetricCard
        label="Request Reschedule"
        value={meta?.rescheduleRequests ?? 0}
        helperText="Pending or recent changes"
        tone="neutral"
        icon="alerts"
      />
    </section>
  );
}
