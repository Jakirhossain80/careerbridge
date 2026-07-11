"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Undo2 } from "lucide-react";

import { ListSkeleton } from "@/components/skeletons";
import { Button, Card, ConfirmationModal, EmptyState } from "@/components/ui";
import { ApplicationStatusBadge } from "@/components/job-seeker/status";
import { appToast } from "@/lib/toast";
import { getAppliedJobs, withdrawApplication } from "@/services/applications.service";

const jobTitle = (job: unknown) =>
  typeof job === "object" && job && "title" in job ? String(job.title) : "Job";

const companyName = (job: unknown) =>
  typeof job === "object" && job && "companyName" in job ? String(job.companyName ?? "") : "";

export default function AppliedJobsList() {
  const queryClient = useQueryClient();
  const [pendingWithdraw, setPendingWithdraw] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["applied-jobs"],
    queryFn: () => getAppliedJobs(),
    refetchOnMount: "always",
  });

  const withdrawMutation = useMutation({
    mutationFn: withdrawApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applied-jobs"] });
      setPendingWithdraw(null);
      appToast.success("Application withdrawn successfully.");
    },
    onError: () => {
      appToast.error("Unable to withdraw application.");
    },
  });

  const applications = data?.applications ?? [];

  if (isLoading) return <ListSkeleton count={4} showIcon={false} />;

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
    <>
      <div className="grid gap-4">
        {applications.map((application) => {
          const title = jobTitle(application.jobId);

          return (
            <Card key={application._id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold">{title}</h2>
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
                    onClick={() => setPendingWithdraw({ id: application._id, title })}
                    leftIcon={<Undo2 className="size-4" />}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <ConfirmationModal
        open={Boolean(pendingWithdraw)}
        title="Withdraw application?"
        description={`Your application for ${pendingWithdraw?.title ?? "this job"} will be marked as withdrawn.`}
        confirmLabel="Withdraw Application"
        variant="destructive"
        isLoading={withdrawMutation.isPending}
        onCancel={() => setPendingWithdraw(null)}
        onConfirm={() => {
          if (pendingWithdraw) {
            withdrawMutation.mutate(pendingWithdraw.id);
          }
        }}
      />
    </>
  );
}
