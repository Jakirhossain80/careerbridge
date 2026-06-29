"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { ListSkeleton } from "@/components/skeletons";
import { Button, Card, EmptyState } from "@/components/ui";
import { getSavedJobs, unsaveJob } from "@/services/saved-jobs.service";

const getJobId = (job: unknown) =>
  typeof job === "object" && job && "_id" in job ? String(job._id) : String(job);

const getTitle = (job: unknown) =>
  typeof job === "object" && job && "title" in job ? String(job.title) : "Saved job";

const getCompany = (job: unknown) =>
  typeof job === "object" && job && "companyName" in job ? String(job.companyName ?? "") : "";

export default function SavedJobsList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: () => getSavedJobs(),
  });

  const mutation = useMutation({
    mutationFn: unsaveJob,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });

  const savedJobs = data?.savedJobs ?? [];

  if (isLoading) return <ListSkeleton count={4} showIcon={false} />;
  if (!savedJobs.length) {
    return (
      <EmptyState
        title="No saved jobs yet."
        description="Save jobs from listings or job details to revisit them later."
        actionLabel="Browse jobs"
        actionHref="/jobs"
      />
    );
  }

  return (
    <div className="grid gap-4">
      {savedJobs.map((item) => {
        const id = getJobId(item.jobId);
        return (
          <Card key={item._id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">{getTitle(item.jobId)}</h2>
                <p className="mt-1 text-sm text-slate-600">{getCompany(item.jobId)}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/jobs/${id}`}>
                  <Button variant="outline">View job</Button>
                </Link>
                <Button
                  variant="danger"
                  isLoading={mutation.isPending}
                  onClick={() => mutation.mutate(id)}
                  leftIcon={<Trash2 className="size-4" />}
                >
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
