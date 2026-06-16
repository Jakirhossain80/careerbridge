import { Bookmark, Send } from "lucide-react";

import { Button } from "@/components/ui";
import type { JobDetails } from "@/lib/job-details-data";

type MobileApplyBarProps = {
  job: JobDetails;
};

export default function MobileApplyBar({ job }: MobileApplyBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-surface/95 px-4 py-3 shadow-lg shadow-slate-900/10 backdrop-blur lg:hidden dark:border-slate-700">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <Button
          variant="outline"
          className="size-11 shrink-0 p-0"
          aria-label={`Save ${job.title}`}
        >
          <Bookmark className="size-4" aria-hidden="true" />
        </Button>
        <Button className="h-11 flex-1" leftIcon={<Send className="size-4" />}>
          Apply Now
        </Button>
      </div>
    </div>
  );
}
