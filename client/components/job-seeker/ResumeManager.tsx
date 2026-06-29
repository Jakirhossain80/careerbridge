"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Star, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { ListSkeleton } from "@/components/skeletons";
import { Badge, Button, Card, ConfirmationModal, EmptyState } from "@/components/ui";
import { appToast } from "@/lib/toast";
import {
  deleteResume,
  getResumes,
  setDefaultResume,
  uploadResume,
} from "@/services/resumes.service";
import type { ResumeFile } from "@/types/resume.types";

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

export default function ResumeManager() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [resumeToDelete, setResumeToDelete] = useState<ResumeFile | null>(null);
  const queryClient = useQueryClient();
  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ["job-seeker-resumes"],
    queryFn: getResumes,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["job-seeker-resumes"] });

  const uploadMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: async () => {
      setMessage("Resume uploaded.");
      await invalidate();
      appToast.success("Resume uploaded successfully.");
    },
    onError: () => {
      setMessage("Failed to upload resume.");
      appToast.error("Failed to upload resume.");
    },
  });

  const defaultMutation = useMutation({
    mutationFn: setDefaultResume,
    onSuccess: () => {
      invalidate();
      appToast.success("Default resume updated.");
    },
    onError: () => appToast.error("Unable to update default resume."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      invalidate();
      setResumeToDelete(null);
      appToast.success("Resume deleted successfully.");
    },
    onError: () => appToast.error("Unable to delete resume."),
  });

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Resumes</h2>
            <p className="mt-1 text-sm text-slate-600">Upload PDF or document resumes and set one as default.</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("resume", file);
              uploadMutation.mutate(formData);
              event.target.value = "";
            }}
          />
          <Button
            onClick={() => inputRef.current?.click()}
            isLoading={uploadMutation.isPending}
            leftIcon={<Upload className="size-4" />}
          >
            Upload resume
          </Button>
        </div>
        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      </Card>

      {isLoading ? <ListSkeleton count={3} /> : null}
      {!isLoading && resumes.length === 0 ? (
        <EmptyState
          title="No resumes uploaded yet."
          description="Upload your resume before applying to jobs."
          actionLabel="Upload resume"
          onAction={() => inputRef.current?.click()}
        />
      ) : null}
      <div className="grid gap-4">
        {resumes.map((resume) => (
          <Card key={resume._id}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{resume.fileName}</p>
                    {resume.isDefault ? <Badge variant="success">Default</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {resume.fileType} · {formatSize(resume.fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => defaultMutation.mutate(resume._id)}
                  disabled={resume.isDefault}
                  leftIcon={<Star className="size-4" />}
                >
                  Set default
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setResumeToDelete(resume)}
                  leftIcon={<Trash2 className="size-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <ConfirmationModal
        open={Boolean(resumeToDelete)}
        title="Delete resume?"
        description="This removes the resume from your CareerBridge profile and it will no longer be available for applications."
        confirmLabel="Delete Resume"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onCancel={() => setResumeToDelete(null)}
        onConfirm={() => {
          if (resumeToDelete) {
            deleteMutation.mutate(resumeToDelete._id);
          }
        }}
      >
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">{resumeToDelete?.fileName ?? "Selected resume"}</p>
        </div>
      </ConfirmationModal>
    </div>
  );
}
