"use client";

import { Archive, Download, Power, PowerOff, X } from "lucide-react";

import Button from "@/components/ui/Button";

type CategoryBulkActionsBarProps = {
  selectedCount: number;
  onClearSelection: () => void;
};

export default function CategoryBulkActionsBar({
  selectedCount,
  onClearSelection,
}: CategoryBulkActionsBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-5xl flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/15 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-900">
        {selectedCount} {selectedCount === 1 ? "category" : "categories"} selected
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk activate will be enabled when the backend endpoint is available."
          leftIcon={<Power className="size-4" aria-hidden="true" />}
        >
          Activate
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk deactivate will be enabled when the backend endpoint is available."
          leftIcon={<PowerOff className="size-4" aria-hidden="true" />}
        >
          Deactivate
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk archive will be enabled when archive endpoints are available."
          leftIcon={<Archive className="size-4" aria-hidden="true" />}
        >
          Archive
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled
          title="Bulk export will be enabled when export endpoints are available."
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
          aria-label="Clear selected categories"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
