"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button, Input, Modal, Select, Textarea } from "@/components/ui";
import {
  interviewSchema,
  type InterviewFormValues,
} from "@/lib/validations/interview.schema";
import type { Interview } from "@/types/interview.types";
import {
  interviewStatusLabels,
  interviewTypeLabels,
} from "@/types/interview.types";

type ScheduleInterviewModalProps = {
  open: boolean;
  interview?: Interview | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: InterviewFormValues) => void;
};

const defaultValues: InterviewFormValues = {
  applicationId: "",
  jobId: "",
  candidateId: "",
  candidateName: "",
  candidateEmail: "",
  candidateAvatar: "",
  jobTitle: "",
  interviewerName: "",
  interviewType: "video_call",
  interviewDate: "",
  interviewTime: "",
  meetingLink: "",
  location: "",
  notes: "",
  status: "scheduled",
};

const typeOptions = Object.entries(interviewTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

const statusOptions = Object.entries(interviewStatusLabels).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

function toFormValues(interview?: Interview | null): InterviewFormValues {
  if (!interview) {
    return defaultValues;
  }

  return {
    applicationId: interview.applicationId,
    jobId: interview.jobId,
    candidateId: interview.candidateId,
    candidateName: interview.candidateName ?? "",
    candidateEmail: interview.candidateEmail ?? "",
    candidateAvatar: interview.candidateAvatar ?? "",
    jobTitle: interview.jobTitle ?? "",
    interviewerName: interview.interviewerName,
    interviewType: interview.interviewType,
    interviewDate: interview.interviewDate,
    interviewTime: interview.interviewTime,
    meetingLink: interview.meetingLink ?? "",
    location: interview.location ?? "",
    notes: interview.notes ?? "",
    status: interview.status,
  };
}

export default function ScheduleInterviewModal({
  open,
  interview,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ScheduleInterviewModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues,
  });

  const interviewType = useWatch({ control, name: "interviewType" });
  const isEditMode = Boolean(interview);

  useEffect(() => {
    if (open) {
      reset(toFormValues(interview));
    }
  }, [interview, open, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Interview" : "Schedule Interview"}
      description="Add the candidate, schedule, interview type, and status details."
      className="max-h-[92dvh] max-w-3xl overflow-y-auto"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="interview-form"
            isLoading={isSubmitting}
          >
            {isEditMode ? "Save Changes" : "Schedule Interview"}
          </Button>
        </>
      }
    >
      <form
        id="interview-form"
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Application ID"
          required
          error={errors.applicationId?.message}
          {...register("applicationId")}
        />
        <Input
          label="Candidate ID"
          required
          error={errors.candidateId?.message}
          {...register("candidateId")}
        />
        <Input
          label="Candidate name"
          error={errors.candidateName?.message}
          {...register("candidateName")}
        />
        <Input
          type="email"
          label="Candidate email"
          error={errors.candidateEmail?.message}
          {...register("candidateEmail")}
        />
        <Input
          label="Job ID"
          required
          error={errors.jobId?.message}
          {...register("jobId")}
        />
        <Input
          label="Job title"
          required
          error={errors.jobTitle?.message}
          {...register("jobTitle")}
        />
        <Input
          label="Interviewer name"
          required
          error={errors.interviewerName?.message}
          {...register("interviewerName")}
        />
        <Select
          label="Interview type"
          required
          options={typeOptions}
          error={errors.interviewType?.message}
          {...register("interviewType")}
        />
        <Input
          type="date"
          label="Interview date"
          required
          error={errors.interviewDate?.message}
          {...register("interviewDate")}
        />
        <Input
          type="time"
          label="Interview time"
          required
          error={errors.interviewTime?.message}
          {...register("interviewTime")}
        />
        <Input
          label="Meeting link"
          required={interviewType === "online" || interviewType === "video_call"}
          error={errors.meetingLink?.message}
          {...register("meetingLink")}
        />
        <Input
          label="Location"
          required={interviewType === "on_site"}
          error={errors.location?.message}
          {...register("location")}
        />
        <Select
          label="Status"
          required
          options={statusOptions}
          error={errors.status?.message}
          {...register("status")}
        />
        <Textarea
          label="Notes"
          wrapperClassName="sm:col-span-2"
          error={errors.notes?.message}
          {...register("notes")}
        />
      </form>
    </Modal>
  );
}
