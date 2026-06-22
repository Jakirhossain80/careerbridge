import Link from "next/link";
import { BriefcaseBusiness, Plus } from "lucide-react";

import { Button } from "@/components/ui";
import type { JobsTab } from "@/components/employer-jobs/my-jobs/MyPostedJobsPage";

type MyJobsEmptyStateProps = {
  activeTab: JobsTab;
};

export default function MyJobsEmptyState({ activeTab }: MyJobsEmptyStateProps) {
  const isAllJobs = activeTab === "all";

  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-blue-50 text-primary dark:bg-blue-500/10">
        <BriefcaseBusiness className="size-7" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-foreground">
        {isAllJobs ? "No posted jobs yet" : `No ${activeTab} jobs`}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        {isAllJobs
          ? "Create your first job post to start collecting qualified applicants."
          : "Try another status tab or create a new job post for this workspace."}
      </p>
      <Link href="/employer/dashboard/jobs/new" className="mt-5">
        <Button
          type="button"
          leftIcon={<Plus className="size-4" aria-hidden="true" />}
        >
          Post New Job
        </Button>
      </Link>
    </div>
  );
}
