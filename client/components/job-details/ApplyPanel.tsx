import { Bookmark, Send, Share2, ShieldCheck } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { JobDetails } from "@/lib/job-details-data";

type ApplyPanelProps = {
  job: JobDetails;
};

export default function ApplyPanel({ job }: ApplyPanelProps) {
  return (
    <aside className="hidden lg:block" aria-label="Application actions">
      <Card className="sticky top-6" contentClassName="p-6">
        <p className="text-sm font-semibold text-primary">
          {job.applicationRate}
        </p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">
          Apply for this role
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Submit your profile before {job.deadline}. The employer usually
          responds within a few business days.
        </p>

        <div className="mt-6 grid gap-3">
          <Button size="lg" className="w-full" leftIcon={<Send className="size-4" />}>
            Apply Now
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              leftIcon={<Bookmark className="size-4" />}
              aria-label={`Save ${job.title}`}
            >
              Save
            </Button>
            <Button
              variant="outline"
              className="w-full"
              leftIcon={<Share2 className="size-4" />}
              aria-label={`Share ${job.title}`}
            >
              Share
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>
              CareerBridge checks employer profiles and keeps your contact
              details private until you apply.
            </p>
          </div>
        </div>
      </Card>
    </aside>
  );
}
