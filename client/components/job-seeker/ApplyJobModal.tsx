"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button, Modal, Select, Textarea } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import {
  applyJobSchema,
  type ApplyJobFormValues,
} from "@/lib/validations/application.schema";
import { getApiErrorMessage } from "@/lib/api";
import { applyJob } from "@/services/applications.service";
import { getResumes } from "@/services/resumes.service";

type ApplyJobModalProps = {
  jobId: string;
  jobTitle: string;
  triggerLabel?: string;
  triggerClassName?: string;
  onApplicationSubmitted?: () => void;
};

export default function ApplyJobModal({
  jobId,
  jobTitle,
  triggerLabel = "Apply Now",
  triggerClassName,
  onApplicationSubmitted,
}: ApplyJobModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();
  const { data: resumes = [] } = useQuery({
    queryKey: ["job-seeker-resumes"],
    queryFn: getResumes,
    enabled: open && Boolean(user),
  });

  const form = useForm<ApplyJobFormValues>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: { jobId, resumeId: "", coverLetter: "" },
  });

  const mutation = useMutation({
    mutationFn: applyJob,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["applied-jobs"] });
      onApplicationSubmitted?.();
      setOpen(false);
      form.reset({ jobId, resumeId: "", coverLetter: "" });
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error));
    },
  });

  const handleOpen = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/jobs/${jobId}`)}`);
      return;
    }
    setErrorMessage("");
    setOpen(true);
  };

  return (
    <>
      <Button className={triggerClassName} onClick={handleOpen}>
        {triggerLabel}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Apply to ${jobTitle}`}
        description="Select the resume you want to share with the employer."
      >
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <input type="hidden" {...form.register("jobId")} />
          <Select
            label="Resume"
            placeholder="Select a resume"
            {...form.register("resumeId")}
            error={form.formState.errors.resumeId?.message}
            options={resumes.map((resume) => ({
              label: `${resume.fileName}${resume.isDefault ? " (default)" : ""}`,
              value: resume._id,
            }))}
          />
          <Textarea
            label="Cover letter"
            helperText="Optional, maximum 3000 characters."
            {...form.register("coverLetter")}
            error={form.formState.errors.coverLetter?.message}
          />
          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
          <div className="flex justify-end">
            <Button type="submit" isLoading={mutation.isPending}>
              Submit application
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
