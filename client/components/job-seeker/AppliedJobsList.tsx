"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Undo2 } from "lucide-react";

import { Button, Card, EmptyState } from "@/components/ui";
import { ApplicationStatusBadge } from "@/components/job-seeker/status";
import { getAppliedJobs, withdrawApplication } from "@/services/applications.service";

const jobTitle = (job: unknown) =>
  typeof job === "object" && job && "title" in job ? String(job.title) : "Job";

const companyName = (job: unknown) =>
  typeof job === "object" && job && "companyName" in job ? String(job.companyName ?? "") : "";

export default function AppliedJobsList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["applied-jobs"],
    queryFn: () => getAppliedJobs(),
  });

  const withdrawMutation = useMutation({
    mutationFn: withdrawApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applied-jobs"] });
    },
  });

  const applications = data?.applications ?? [];

  if (isLoading) return <Card>Loading applications...</Card>;

  if (!applications.length) {
    return (
      <EmptyState
        title="No applications yet."
        description="Jobs you apply to will appear here with status updates."
        actionLabel="Browse jobs"
        actionHref="/jobs"
      />
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <Card key={application._id}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">{jobTitle(application.jobId)}</h2>
              <p className="mt-1 text-sm text-slate-600">{companyName(application.jobId)}</p>
              <p className="mt-2 text-sm text-slate-500">
                Applied {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ApplicationStatusBadge status={application.status} />
              <Link href={`/profile/applications/${application._id}`}>
                <Button variant="outline" leftIcon={<Eye className="size-4" />}>Details</Button>
              </Link>
              <Button
                variant="danger"
                disabled={application.status === "withdrawn"}
                onClick={() => withdrawMutation.mutate(application._id)}
                leftIcon={<Undo2 className="size-4" />}
              >
                Withdraw
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
