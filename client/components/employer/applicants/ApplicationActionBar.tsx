"use client";

import { Badge, Button, Card } from "@/components/ui";
import type { ApplicationStatus } from "@/types/application.types";
import { applicationStatusLabels } from "@/types/application.types";

type ApplicationActionBarProps = {
  status: ApplicationStatus;
  isUpdating?: boolean;
  onStatusChange: (status: ApplicationStatus) => void;
};

const statusBadgeClasses: Record<ApplicationStatus, string> = {
  applied: "border-slate-200 bg-slate-100 text-slate-700",
  submitted: "border-slate-200 bg-slate-100 text-slate-700",
  under_review: "border-blue-200 bg-blue-50 text-blue-700",
  in_review: "border-blue-200 bg-blue-50 text-blue-700",
  reviewing: "border-blue-200 bg-blue-50 text-blue-700",
  shortlisted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  interview: "border-indigo-200 bg-indigo-50 text-indigo-700",
  offered: "border-emerald-200 bg-emerald-50 text-emerald-800",
  hired: "border-green-200 bg-green-50 text-green-800",
  rejected: "border-red-200 bg-red-50 text-red-700",
  withdrawn: "border-slate-200 bg-slate-100 text-slate-700",
};

export default function ApplicationActionBar({
  status,
  isUpdating = false,
  onStatusChange,
}: ApplicationActionBarProps) {
  return (
    <Card contentClassName="p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Current status</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Badge className={statusBadgeClasses[status]}>
              {applicationStatusLabels[status]}
            </Badge>
            <span className="text-sm text-muted">
              Move this applicant through your hiring pipeline.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={isUpdating}
            disabled={status === "rejected"}
            onClick={() => onStatusChange("rejected")}
          >
            Reject
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isUpdating}
            disabled={status === "shortlisted"}
            onClick={() => onStatusChange("shortlisted")}
          >
            Shortlist
          </Button>
          <Button
            type="button"
            size="sm"
            isLoading={isUpdating}
            disabled={status === "interview"}
            onClick={() => onStatusChange("interview")}
          >
            Schedule Interview
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            isLoading={isUpdating}
            disabled={status === "hired"}
            onClick={() => onStatusChange("hired")}
          >
            Hire Candidate
          </Button>
        </div>
      </div>
    </Card>
  );
}
