"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Undo2 } from "lucide-react";

import { DetailPageSkeleton } from "@/components/skeletons";
import { Button, Card } from "@/components/ui";
import { ApplicationStatusBadge } from "@/components/job-seeker/status";
import { appToast } from "@/lib/toast";
import {
  getApplicationDetails,
  withdrawApplication,
} from "@/services/applications.service";

const getObjectValue = (value: unknown, key: string) =>
  typeof value === "object" && value && key in value
    ? String((value as Record<string, unknown>)[key] ?? "")
    : "";

export default function ApplicationDetails({ applicationId }: { applicationId: string }) {
  const queryClient = useQueryClient();
  const { data: application, isLoading } = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplicationDetails(applicationId),
  });

  const withdrawMutation = useMutation({
    mutationFn: withdrawApplication,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
      await queryClient.invalidateQueries({ queryKey: ["applied-jobs"] });
      appToast.success("Application withdrawn successfully.");
    },
    onError: () => {
      appToast.error("Unable to withdraw application.");
    },
  });

  if (isLoading) return <DetailPageSkeleton />;
  if (!application) return <Card>Application not found.</Card>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card header={<h2 className="text-xl font-bold">{getObjectValue(application.jobId, "title") || "Application details"}</h2>}>
        <div className="space-y-6">
          <section>
            <h3 className="font-semibold">Cover letter</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {application.coverLetter || "No cover letter submitted."}
            </p>
          </section>
          <section>
            <h3 className="font-semibold">Resume used</h3>
            {application.resumeUrl ? (
              <a className="mt-2 inline-flex text-sm font-semibold text-primary" href={application.resumeUrl}>
                {application.resume ?? "View resume"}
              </a>
            ) : (
              <p className="mt-2 text-sm text-slate-600">{application.resume ?? "Resume unavailable"}</p>
            )}
          </section>
          <section>
            <h3 className="font-semibold">Timeline</h3>
            <div className="mt-3 space-y-3">
              {(application.timeline ?? []).map((item, index) => (
                <div key={`${item.status}-${index}`} className="rounded-md border border-slate-200 p-3">
                  <ApplicationStatusBadge status={item.status} />
                  <p className="mt-2 text-sm text-slate-600">{item.note ?? "Status updated"}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Card>
      <aside>
        <Card>
          <div className="space-y-4">
            <ApplicationStatusBadge status={application.status} />
            <p className="text-sm text-slate-600">
              Applied {new Date(application.createdAt).toLocaleDateString()}
            </p>
            <Button
              variant="danger"
              className="w-full"
              disabled={application.status === "withdrawn"}
              isLoading={withdrawMutation.isPending}
              onClick={() => withdrawMutation.mutate(application._id)}
              leftIcon={<Undo2 className="size-4" />}
            >
              Withdraw application
            </Button>
          </div>
        </Card>
      </aside>
    </div>
  );
}
