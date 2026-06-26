"use client";

import { Archive, Download, ShieldCheck, X, XCircle } from "lucide-react";

import Button from "@/components/ui/Button";

type JobBulkActionsBarProps = {
  selectedCount: number;
  onClearSelection: () => void;
};

export default function JobBulkActionsBar({
  selectedCount,
  onClearSelection,
}: JobBulkActionsBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-5xl flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/15 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-900">
        {selectedCount} {selectedCount === 1 ? "job" : "jobs"} selected
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk approve will be enabled when the backend endpoint is available."
          leftIcon={<ShieldCheck className="size-4" aria-hidden="true" />}
        >
          Approve
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk reject will be enabled when the backend endpoint is available."
          leftIcon={<XCircle className="size-4" aria-hidden="true" />}
        >
          Reject
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk archive will be enabled when the backend endpoint is available."
          leftIcon={<Archive className="size-4" aria-hidden="true" />}
        >
          Archive
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk close will be enabled when the backend endpoint is available."
        >
          Close
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
          aria-label="Clear selected jobs"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
