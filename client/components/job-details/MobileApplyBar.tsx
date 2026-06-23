"use client";

import { Bookmark } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ApplyJobModal from "@/components/job-seeker/ApplyJobModal";
import { Button } from "@/components/ui";
import type { JobDetails } from "@/lib/job-details-data";

type MobileApplyBarProps = {
  job: JobDetails;
};

export default function MobileApplyBar({ job }: MobileApplyBarProps) {
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: async () => {
      const { saveJob } = await import("@/services/saved-jobs.service");
      return saveJob(job.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-surface/95 px-4 py-3 shadow-lg shadow-slate-900/10 backdrop-blur lg:hidden dark:border-slate-700">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <Button
          variant="outline"
          className="size-11 shrink-0 p-0"
          aria-label={`Save ${job.title}`}
          isLoading={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          <Bookmark className="size-4" aria-hidden="true" />
        </Button>
        <ApplyJobModal jobId={job.id} jobTitle={job.title} triggerClassName="h-11 flex-1" />
      </div>
    </div>
  );
}
