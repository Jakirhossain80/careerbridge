"use client";

import Link from "next/link";
import { Save } from "lucide-react";

import { Button } from "@/components/ui";

type MobileSaveBarProps = {
  cancelHref: string;
};

export default function MobileSaveBar({ cancelHref }: MobileSaveBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-surface/95 px-4 py-3 shadow-lg backdrop-blur sm:hidden">
      <div className="flex gap-3">
        <Link
          href={cancelHref}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          form="company-profile-edit-form"
          className="flex-1"
          leftIcon={<Save className="size-4" aria-hidden="true" />}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
