import { Badge } from "@/components/ui";
import {
  jobSeekerApplicationStatusLabels,
  type JobSeekerApplicationStatus,
} from "@/types/application.types";

export function ApplicationStatusBadge({
  status,
}: {
  status: JobSeekerApplicationStatus;
}) {
  const variant =
    status === "hired" || status === "offered"
      ? "success"
      : status === "rejected" || status === "withdrawn"
        ? "danger"
        : status === "shortlisted" || status === "interview"
          ? "warning"
          : "primary";

  return <Badge variant={variant}>{jobSeekerApplicationStatusLabels[status] ?? status}</Badge>;
}
