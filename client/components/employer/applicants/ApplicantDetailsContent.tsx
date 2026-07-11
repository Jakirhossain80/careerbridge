"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Search } from "lucide-react";

import ApplicantProfilePanel from "@/components/employer/applicants/ApplicantProfilePanel";
import ApplicationActionBar from "@/components/employer/applicants/ApplicationActionBar";
import CoverLetterCard from "@/components/employer/applicants/CoverLetterCard";
import InternalNotesCard from "@/components/employer/applicants/InternalNotesCard";
import ResumePreviewCard from "@/components/employer/applicants/ResumePreviewCard";
import StatusHistoryCard from "@/components/employer/applicants/StatusHistoryCard";
import { Badge, Button, Card, ConfirmationModal, EmptyState, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import {
  addApplicationNote,
  getApplicationById,
  updateApplicationStatus,
} from "@/services/applications.service";
import type { ApplicationStatus } from "@/types/application.types";
import { applicationStatusLabels } from "@/types/application.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function buildApplicantsHref(searchParams: URLSearchParams) {
  const nextParams = new URLSearchParams(searchParams);
  const from = nextParams.get("from");
  nextParams.delete("from");

  const baseHref =
    from === "shortlisted"
      ? "/employer/applicants/shortlisted"
      : "/employer/applicants";
  const params = nextParams.toString();

  return params ? `${baseHref}?${params}` : baseHref;
}

function ApplicantDetailsLoadingState() {
  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_22rem]">
      <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
      <div className="space-y-5">
        <div className="h-28 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
        <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
      </div>
      <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
      <p className="sr-only">Loading applicant details...</p>
    </div>
  );
}

export default function ApplicantDetailsContent() {
  const params = useParams<{ applicationId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const applicationId = params.applicationId;
  const applicantsHref = buildApplicantsHref(searchParams);
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null);

  const applicationQuery = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplicationById(applicationId),
    enabled: Boolean(applicationId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      applicationId: id,
      status,
    }: {
      applicationId: string;
      status: ApplicationStatus;
    }) => updateApplicationStatus(id, status),
    onSuccess: (updatedApplication) => {
      queryClient.setQueryData(["application", applicationId], updatedApplication);
      queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["employer-applicants"] });
      queryClient.invalidateQueries({ queryKey: ["shortlisted-applicants"] });
      queryClient.invalidateQueries({ queryKey: ["employer-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["job-seeker-dashboard"] });
      setPendingStatus(null);
      appToast.success("Application status updated successfully.");
    },
    onError: (error) => {
      appToast.error(getApiErrorMessage(error));
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ applicationId: id, note }: { applicationId: string; note: string }) =>
      addApplicationNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application", applicationId] });
    },
  });

  if (applicationQuery.isLoading) {
    return <ApplicantDetailsLoadingState />;
  }

  if (applicationQuery.isError) {
    return (
      <EmptyState
        title="Unable to load applicant details. Please try again."
        description="The application may be unavailable, or the details service may not be ready yet."
        actionLabel="Retry"
        onAction={() => applicationQuery.refetch()}
      />
    );
  }

  const application = applicationQuery.data;

  if (!application) {
    return (
      <EmptyState
        title="Applicant details not found."
        description="This applicant may have been removed or the application ID is invalid."
        actionLabel="Back to Applicants"
        actionHref={applicantsHref}
      />
    );
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") ?? "").trim();
    const nextParams = new URLSearchParams(searchParams);

    if (search) {
      nextParams.set("search", search);
    } else {
      nextParams.delete("search");
    }

    router.push(buildApplicantsHref(nextParams));
  }

  return (
    <div className="flex flex-col gap-6">
      <Card contentClassName="p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <Link
              href={applicantsHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-700"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Applicants
            </Link>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">
              Applicants &gt; {application.applicantName}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {application.applicantName}
              </h1>
              <Badge>{applicationStatusLabels[application.status]}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span>{application.jobTitle}</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                Applied {formatDate(application.appliedAt)}
              </span>
            </div>
          </div>

          <form
            className="flex w-full gap-2 sm:max-w-md"
            onSubmit={handleSearchSubmit}
          >
            <Input
              name="search"
              type="search"
              placeholder="Search applications"
              defaultValue={searchParams.get("search") ?? ""}
              wrapperClassName="flex-1"
              className="h-11"
            />
            <Button
              type="submit"
              variant="outline"
              leftIcon={<Search className="size-4" aria-hidden="true" />}
            >
              Search
            </Button>
          </form>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_22rem]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ApplicantProfilePanel application={application} />
        </aside>

        <main className="min-w-0 space-y-5">
          <ApplicationActionBar
            status={application.status}
            isUpdating={updateStatusMutation.isPending}
            onStatusChange={setPendingStatus}
          />

          {application.careerSummary ? (
            <Card
              header={
                <h2 className="text-lg font-bold text-foreground">
                  Career Summary
                </h2>
              }
              contentClassName="p-5"
            >
              <p className="text-sm leading-7 text-muted">
                {application.careerSummary}
              </p>
            </Card>
          ) : null}

          <ResumePreviewCard application={application} />
          <CoverLetterCard coverLetter={application.coverLetter} />
        </main>

        <aside className="space-y-5 xl:sticky xl:top-20 xl:self-start">
          <InternalNotesCard
            notes={application.notes}
            isSubmitting={addNoteMutation.isPending}
            onSubmit={(note) => addNoteMutation.mutate({ applicationId, note })}
          />
          <StatusHistoryCard history={application.statusHistory} />
        </aside>
      </div>
      <ConfirmationModal
        open={Boolean(pendingStatus)}
        title={
          pendingStatus
            ? `${applicationStatusLabels[pendingStatus]} applicant?`
            : "Update applicant status?"
        }
        description={`This will update ${application.applicantName}'s application status to ${
          pendingStatus ? applicationStatusLabels[pendingStatus].toLowerCase() : "the selected status"
        }.`}
        confirmLabel={
          pendingStatus
            ? `Mark ${applicationStatusLabels[pendingStatus]}`
            : "Update Status"
        }
        variant={pendingStatus === "rejected" ? "destructive" : "warning"}
        isLoading={updateStatusMutation.isPending}
        onCancel={() => setPendingStatus(null)}
        onConfirm={() => {
          if (pendingStatus) {
            updateStatusMutation.mutate({ applicationId, status: pendingStatus });
          }
        }}
      />
    </div>
  );
}
