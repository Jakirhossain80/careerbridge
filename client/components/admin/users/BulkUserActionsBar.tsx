"use client";

import { CheckCircle2, ShieldAlert, X } from "lucide-react";

import Button from "@/components/ui/Button";

type BulkUserActionsBarProps = {
  selectedCount: number;
  onClearSelection: () => void;
};

export default function BulkUserActionsBar({
  selectedCount,
  onClearSelection,
}: BulkUserActionsBarProps) {
  if (selectedCount <= 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-3xl flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/15 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-900">
        {selectedCount} {selectedCount === 1 ? "user" : "users"} selected
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          leftIcon={<CheckCircle2 className="size-4" aria-hidden="true" />}
          title="Bulk activate will be enabled when the backend endpoint is available."
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
          leftIcon={<ShieldAlert className="size-4" aria-hidden="true" />}
          title="Bulk block will be enabled when the backend endpoint is available."
        >
          Block
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-9 p-0"
          onClick={onClearSelection}
          aria-label="Clear selected users"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
