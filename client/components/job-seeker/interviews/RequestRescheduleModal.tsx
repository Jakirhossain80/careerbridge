"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, Input, Modal, Textarea } from "@/components/ui";
import {
  interviewRescheduleSchema,
  type InterviewRescheduleFormValues,
} from "@/lib/validations/interview.schema";
import type { JobSeekerInterview } from "@/types/interview.types";

type RequestRescheduleModalProps = {
  open: boolean;
  interview: JobSeekerInterview | null;
  isSubmitting: boolean;
  submitError?: string;
  onClose: () => void;
  onSubmit: (values: InterviewRescheduleFormValues) => void;
};

export default function RequestRescheduleModal({
  open,
  interview,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}: RequestRescheduleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InterviewRescheduleFormValues>({
    resolver: zodResolver(interviewRescheduleSchema),
    defaultValues: {
      preferredDate: "",
      preferredTime: "",
      reason: "",
      note: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request Reschedule"
      description={
        interview
          ? `Send a reschedule request for ${interview.jobTitle} at ${interview.companyName}.`
          : "Send a reschedule request to the employer."
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="request-reschedule-form"
            isLoading={isSubmitting}
          >
            Send Request
          </Button>
        </>
      }
    >
      <form
        id="request-reschedule-form"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="date"
            label="Preferred date"
            error={errors.preferredDate?.message}
            {...register("preferredDate")}
          />
          <Input
            type="time"
            label="Preferred time"
            error={errors.preferredTime?.message}
            {...register("preferredTime")}
          />
        </div>
        <Textarea
          label="Reason"
          placeholder="Share why you need to reschedule."
          error={errors.reason?.message}
          {...register("reason")}
        />
        <Textarea
          label="Additional note"
          placeholder="Optional context for the hiring team."
          error={errors.note?.message}
          {...register("note")}
        />
        {submitError ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {submitError}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
