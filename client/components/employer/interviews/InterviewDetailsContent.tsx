"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays } from "lucide-react";

import CandidateSummaryCard from "@/components/employer/interviews/CandidateSummaryCard";
import HiringPipelineCard from "@/components/employer/interviews/HiringPipelineCard";
import InterviewDetailsActions from "@/components/employer/interviews/InterviewDetailsActions";
import InterviewEvaluationForm from "@/components/employer/interviews/InterviewEvaluationForm";
import InterviewInfoCard from "@/components/employer/interviews/InterviewInfoCard";
import InterviewStatusBadge from "@/components/employer/interviews/InterviewStatusBadge";
import ScheduleInterviewModal from "@/components/employer/interviews/ScheduleInterviewModal";
import { DetailPageSkeleton } from "@/components/skeletons";
import { Button, Card, EmptyState, Modal } from "@/components/ui";
import type {
  InterviewFeedbackFormValues,
  InterviewFormValues,
} from "@/lib/validations/interview.schema";
import {
  getInterviewById,
  submitInterviewFeedback,
  updateInterview,
  updateInterviewStatus,
} from "@/services/interviews.service";
import type { InterviewDetails, InterviewStatus } from "@/types/interview.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function buildInterviewsHref(searchParams: URLSearchParams) {
  const params = searchParams.toString();
  return params ? `/employer/interviews?${params}` : "/employer/interviews";
}

function InterviewDetailsLoadingState() {
  return (
    <DetailPageSkeleton
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]"
    />
  );
}

export default function InterviewDetailsContent() {
  const params = useParams<{ interviewId: string }>();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const interviewId = params.interviewId;
  const interviewsHref = useMemo(
    () => buildInterviewsHref(searchParams),
    [searchParams],
  );

  const [selectedStatus, setSelectedStatus] =
    useState<InterviewStatus>("scheduled");
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [copiedMeetingLink, setCopiedMeetingLink] = useState(false);

  const interviewQuery = useQuery({
    queryKey: ["interview", interviewId],
    queryFn: () => getInterviewById(interviewId),
    enabled: Boolean(interviewId),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<InterviewFormValues>;
    }) => updateInterview(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview", interviewId] });
      queryClient.invalidateQueries({ queryKey: ["employer-interviews"] });
      setIsRescheduleModalOpen(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InterviewStatus }) =>
      updateInterviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview", interviewId] });
      queryClient.invalidateQueries({ queryKey: ["employer-interviews"] });
      setIsCancelModalOpen(false);
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: InterviewFeedbackFormValues;
    }) => submitInterviewFeedback(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview", interviewId] });
      queryClient.invalidateQueries({ queryKey: ["employer-interviews"] });
    },
  });

  if (interviewQuery.isLoading) {
    return <InterviewDetailsLoadingState />;
  }

  if (interviewQuery.isError) {
    return (
      <EmptyState
        title="Unable to load interview details. Please try again."
        description="The interview may be unavailable, or the details service may not be ready yet."
        actionLabel="Retry"
        onAction={() => interviewQuery.refetch()}
      />
    );
  }

  const interview = interviewQuery.data as InterviewDetails | undefined;

  if (!interview) {
    return (
      <EmptyState
        title="Interview details not found."
        description="This interview may have been removed or the interview ID is invalid."
        actionLabel="Back to Interviews"
        actionHref={interviewsHref}
      />
    );
  }

  const currentInterview: InterviewDetails = interview;

  function handleStatusChange(status: InterviewStatus) {
    setSelectedStatus(status);
    statusMutation.mutate({ id: currentInterview._id, status });
  }

  function handleReschedule(values: InterviewFormValues) {
    updateMutation.mutate({
      id: currentInterview._id,
      payload: { ...values, status: values.status },
    });
  }

  async function handleCopyMeetingLink() {
    if (!currentInterview.meetingLink) {
      return;
    }

    await navigator.clipboard.writeText(currentInterview.meetingLink);
    setCopiedMeetingLink(true);
    window.setTimeout(() => setCopiedMeetingLink(false), 1800);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card contentClassName="p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <Link
              href={interviewsHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-700"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Interviews
            </Link>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">
              Interviews &gt; Interview Details
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Interview with {interview.candidateName}
              </h1>
              <InterviewStatusBadge status={interview.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span>{interview.jobTitle}</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                {formatDate(interview.interviewDate)} at {interview.interviewTime}
              </span>
              <span>{interview.interviewerTitle ?? "Interview round"}</span>
            </div>
          </div>

          <InterviewDetailsActions
            interview={interview}
            isUpdating={statusMutation.isPending}
            onEdit={() => setIsRescheduleModalOpen(true)}
            onReschedule={() => setIsRescheduleModalOpen(true)}
            onCancel={() => setIsCancelModalOpen(true)}
            onSubmitFeedback={() => {
              document
                .querySelector("#interview-feedback-heading")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            onStatusChange={handleStatusChange}
          />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <main className="min-w-0 space-y-6">
          <InterviewInfoCard
            interview={interview}
            copiedMeetingLink={copiedMeetingLink}
            onCopyMeetingLink={handleCopyMeetingLink}
          />
          <div id="interview-feedback-heading">
            <InterviewEvaluationForm
              isSubmitting={feedbackMutation.isPending}
              onSubmit={(payload) =>
                feedbackMutation.mutate({ id: interview._id, payload })
              }
            />
          </div>
        </main>

        <aside className="space-y-6 xl:sticky xl:top-20 xl:self-start">
          <CandidateSummaryCard interview={interview} />
          <HiringPipelineCard interview={interview} />
        </aside>
      </div>

      <ScheduleInterviewModal
        open={isRescheduleModalOpen}
        interview={interview}
        isSubmitting={updateMutation.isPending}
        onClose={() => setIsRescheduleModalOpen(false)}
        onSubmit={handleReschedule}
      />

      <Modal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Interview"
        description={`Cancel the interview with ${interview.candidateName}? This will update the interview status.`}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Interview
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={statusMutation.isPending && selectedStatus === "cancelled"}
              onClick={() => handleStatusChange("cancelled")}
            >
              Cancel Interview
            </Button>
          </>
        }
      />
    </div>
  );
}
