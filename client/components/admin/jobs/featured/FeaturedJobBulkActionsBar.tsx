"use client";

import { Download, PauseCircle, Trash2, X } from "lucide-react";

import Button from "@/components/ui/Button";

type FeaturedJobBulkActionsBarProps = {
  selectedCount: number;
  onClearSelection: () => void;
};

export default function FeaturedJobBulkActionsBar({
  selectedCount,
  onClearSelection,
}: FeaturedJobBulkActionsBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-5xl flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/15 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-900">
        {selectedCount} featured {selectedCount === 1 ? "job" : "jobs"} selected
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk pause will be enabled when the promotion endpoint is available."
          leftIcon={<PauseCircle className="size-4" aria-hidden="true" />}
        >
          Pause
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          disabled
          title="Bulk remove will be enabled when the promotion endpoint is available."
          leftIcon={<Trash2 className="size-4" aria-hidden="true" />}
        >
          Remove
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
          aria-label="Clear selected featured jobs"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
