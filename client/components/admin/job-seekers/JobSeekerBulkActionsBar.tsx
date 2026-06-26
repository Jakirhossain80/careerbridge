"use client";

import { Download, ShieldAlert, UserCheck, X } from "lucide-react";

import Button from "@/components/ui/Button";

type JobSeekerBulkActionsBarProps = {
  selectedCount: number;
  onClearSelection: () => void;
};

export default function JobSeekerBulkActionsBar({
  selectedCount,
  onClearSelection,
}: JobSeekerBulkActionsBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-4xl flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/15 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-900">
        {selectedCount} {selectedCount === 1 ? "job seeker" : "job seekers"} selected
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk activate will be enabled when the backend endpoint is available."
          leftIcon={<UserCheck className="size-4" aria-hidden="true" />}
        >
          Activate
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk suspend will be enabled when the backend endpoint is available."
        >
          Suspend
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          disabled
          title="Bulk block will be enabled when the backend endpoint is available."
          leftIcon={<ShieldAlert className="size-4" aria-hidden="true" />}
        >
          Block
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk export will be enabled when the backend export endpoint is available."
          leftIcon={<Download className="size-4" aria-hidden="true" />}
        >
          Export
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-9 p-0"
          onClick={onClearSelection}
          aria-label="Clear selected job seekers"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
