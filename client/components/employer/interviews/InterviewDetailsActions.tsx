"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Download,
  Edit,
  ExternalLink,
  RotateCcw,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui";
import type { InterviewDetails, InterviewStatus } from "@/types/interview.types";

type InterviewDetailsActionsProps = {
  interview: InterviewDetails;
  isUpdating?: boolean;
  onEdit: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  onSubmitFeedback: () => void;
  onStatusChange: (status: InterviewStatus) => void;
};

export default function InterviewDetailsActions({
  interview,
  isUpdating = false,
  onEdit,
  onReschedule,
  onCancel,
  onSubmitFeedback,
  onStatusChange,
}: InterviewDetailsActionsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<Edit className="size-4" aria-hidden="true" />}
        onClick={onEdit}
      >
        Edit Interview
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}
        onClick={onReschedule}
      >
        Reschedule
      </Button>
      <Button
        type="button"
        variant="danger"
        size="sm"
        leftIcon={<XCircle className="size-4" aria-hidden="true" />}
        disabled={interview.status === "cancelled"}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="button"
        size="sm"
        leftIcon={<CheckCircle2 className="size-4" aria-hidden="true" />}
        isLoading={isUpdating}
        disabled={interview.status === "confirmed"}
        onClick={() => onStatusChange("confirmed")}
      >
        Mark Confirmed
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        leftIcon={<UserCheck className="size-4" aria-hidden="true" />}
        isLoading={isUpdating}
        disabled={interview.status === "completed"}
        onClick={() => onStatusChange("completed")}
      >
        Mark Completed
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<UserX className="size-4" aria-hidden="true" />}
        isLoading={isUpdating}
        disabled={interview.status === "no_show"}
        onClick={() => onStatusChange("no_show")}
      >
        No Show
      </Button>
      <Link
        href={`/employer/applicants/${interview.applicationId}`}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
      >
        Applicant Details
        <ExternalLink className="size-4" aria-hidden="true" />
      </Link>
      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<Download className="size-4" aria-hidden="true" />}
        disabled={!interview.resumeUrl}
        onClick={() => {
          if (interview.resumeUrl) {
            window.open(interview.resumeUrl, "_blank", "noopener,noreferrer");
          }
        }}
      >
        Download Resume
      </Button>
      <Button type="button" size="sm" onClick={onSubmitFeedback}>
        Submit Feedback
      </Button>
    </div>
  );
}
