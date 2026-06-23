"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, CheckCircle2, Edit, Eye, RotateCcw, XCircle } from "lucide-react";

import { Button, Table } from "@/components/ui";
import type { TableColumn } from "@/components/ui";
import type { Interview } from "@/types/interview.types";
import { interviewTypeLabels } from "@/types/interview.types";
import InterviewStatusBadge from "./InterviewStatusBadge";

type InterviewTableProps = {
  interviews: Interview[];
  loading?: boolean;
  onEdit: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
  onComplete: (interview: Interview) => void;
  onReschedule: (interview: Interview) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function InterviewTable({
  interviews,
  loading = false,
  onEdit,
  onCancel,
  onComplete,
  onReschedule,
}: InterviewTableProps) {
  const searchParams = useSearchParams();
  const detailParams = searchParams.toString();
  const columns: Array<TableColumn<Interview>> = [
    {
      key: "candidate",
      header: "Candidate",
      render: (interview) => (
        <div className="min-w-56">
          <p className="font-semibold text-foreground">
            {interview.candidateName ?? "Unnamed candidate"}
          </p>
          <p className="mt-1 text-sm text-muted">{interview.candidateEmail}</p>
        </div>
      ),
    },
    {
      key: "job",
      header: "Job",
      render: (interview) => (
        <span className="font-medium text-foreground">
          {interview.jobTitle ?? "Untitled role"}
        </span>
      ),
    },
    {
      key: "schedule",
      header: "Schedule",
      render: (interview) => (
        <span className="inline-flex min-w-36 items-center gap-2 text-muted">
          <CalendarDays className="size-4" aria-hidden="true" />
          {formatDate(interview.interviewDate)} {interview.interviewTime}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (interview) => interviewTypeLabels[interview.interviewType],
    },
    {
      key: "interviewer",
      header: "Interviewer",
      render: (interview) => interview.interviewerName,
    },
    {
      key: "status",
      header: "Status",
      render: (interview) => <InterviewStatusBadge status={interview.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "whitespace-normal",
      render: (interview) => (
        <div className="flex min-w-72 flex-wrap gap-2">
          <Link
            href={`/employer/interviews/${interview._id}${detailParams ? `?${detailParams}` : ""}`}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
          >
            <Eye className="size-4" aria-hidden="true" />
            Details
          </Link>
          <Link
            href={`/employer/applicants/${interview.applicationId}`}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
          >
            Applicant
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Edit className="size-4" aria-hidden="true" />}
            onClick={() => onEdit(interview)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}
            onClick={() => onReschedule(interview)}
          >
            Reschedule
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<CheckCircle2 className="size-4" aria-hidden="true" />}
            onClick={() => onComplete(interview)}
            disabled={interview.status === "completed"}
          >
            Complete
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            leftIcon={<XCircle className="size-4" aria-hidden="true" />}
            onClick={() => onCancel(interview)}
            disabled={interview.status === "cancelled"}
          >
            Cancel
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={interviews}
      loading={loading}
      emptyMessage="No interviews found"
      getRowKey={(interview) => interview._id}
    />
  );
}
