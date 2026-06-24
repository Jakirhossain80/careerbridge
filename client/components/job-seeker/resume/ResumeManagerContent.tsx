"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button, LoadingSkeleton } from "@/components/ui";
import CurrentResumeCard from "@/components/job-seeker/resume/CurrentResumeCard";
import ResumeDeleteConfirmModal from "@/components/job-seeker/resume/ResumeDeleteConfirmModal";
import ResumePerformanceCard from "@/components/job-seeker/resume/ResumePerformanceCard";
import ResumeTipsGrid from "@/components/job-seeker/resume/ResumeTipsGrid";
import ResumeUploadDropzone from "@/components/job-seeker/resume/ResumeUploadDropzone";
import ResumeVersionHistory from "@/components/job-seeker/resume/ResumeVersionHistory";
import { getApiErrorMessage } from "@/lib/api";
import {
  RESUME_ALLOWED_EXTENSIONS,
  resumeUploadSchema,
} from "@/lib/validations/resume.schema";
import {
  deleteResume,
  downloadResume,
  getMyResumes,
  replaceResume,
  resumeQueryKeys,
  setDefaultResume,
  uploadResume,
} from "@/services/resumes.service";
import type { ResumeFile } from "@/types/resume.types";

function ResumeManagerLoadingState() {
  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <p className="text-sm font-medium text-muted">Loading resumes...</p>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <div className="space-y-6">
            <LoadingSkeleton variant="card" className="min-h-72" />
            <LoadingSkeleton variant="card" className="min-h-64" />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" className="min-h-64" />
          </div>
        </div>
      </div>
    </main>
  );
}

function buildReplacementFormData(file: File) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("fileName", file.name);
  formData.append("fileType", file.type);
  formData.append("fileSize", String(file.size));
  return formData;
}

export default function ResumeManagerContent() {
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [resumeToDelete, setResumeToDelete] = useState<ResumeFile>();
  const [resumeToReplace, setResumeToReplace] = useState<ResumeFile>();
  const queryClient = useQueryClient();

  const resumesQuery = useQuery({
    queryKey: resumeQueryKeys.manager,
    queryFn: getMyResumes,
  });

  const invalidateResumeData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.manager }),
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.profile }),
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.dashboard }),
    ]);
  };

  const uploadMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: async () => {
      setSubmitError("");
      setStatusMessage("Resume uploaded successfully.");
      await invalidateResumeData();
    },
    onError: (error) => {
      setStatusMessage("");
      setSubmitError(getApiErrorMessage(error) || "Unable to upload resume. Please try again.");
    },
  });

  const replaceMutation = useMutation({
    mutationFn: ({ resumeId, formData }: { resumeId: string; formData: FormData }) =>
      replaceResume(resumeId, formData),
    onSuccess: async () => {
      setSubmitError("");
      setStatusMessage("Resume updated successfully.");
      setResumeToReplace(undefined);
      await invalidateResumeData();
    },
    onError: (error) => {
      setStatusMessage("");
      setSubmitError(getApiErrorMessage(error) || "Unable to update resume. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: async () => {
      setSubmitError("");
      setStatusMessage("Resume deleted successfully.");
      setResumeToDelete(undefined);
      await invalidateResumeData();
    },
    onError: (error) => {
      setStatusMessage("");
      setSubmitError(getApiErrorMessage(error) || "Unable to delete resume. Please try again.");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: setDefaultResume,
    onSuccess: async () => {
      setStatusMessage("Resume restored as active.");
      await invalidateResumeData();
    },
    onError: (error) => {
      setSubmitError(getApiErrorMessage(error) || "Unable to restore resume. Please try again.");
    },
  });

  async function handleReplacementFile(file?: File) {
    if (!file || !resumeToReplace) {
      return;
    }

    const result = await resumeUploadSchema.safeParseAsync({ file });

    if (!result.success) {
      setSubmitError(result.error.issues[0]?.message ?? "Unable to update resume. Please try again.");
      return;
    }

    replaceMutation.mutate({
      resumeId: resumeToReplace._id,
      formData: buildReplacementFormData(file),
    });
  }

  function handleView(resume: ResumeFile) {
    if (resume.fileUrl && typeof window !== "undefined") {
      window.open(resume.fileUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setSubmitError("Resume preview is not available yet.");
  }

  async function handleDownload(resume: ResumeFile) {
    if (resume.fileUrl && typeof window !== "undefined") {
      window.open(resume.fileUrl, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      const result = await downloadResume(resume._id);

      if (result.downloadUrl && typeof window !== "undefined") {
        window.open(result.downloadUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setSubmitError(getApiErrorMessage(error) || "Download is not available yet.");
    }
  }

  function handleRestore(resume: ResumeFile) {
    // TODO: Replace this with a dedicated restore endpoint when backend version restore exists.
    restoreMutation.mutate(resume._id);
  }

  if (resumesQuery.isLoading) {
    return <ResumeManagerLoadingState />;
  }

  if (resumesQuery.isError || !resumesQuery.data) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-lg border border-red-200 bg-red-50 p-6">
          <h1 className="text-base font-semibold text-red-900">
            Unable to load resumes. Please try again.
          </h1>
          <Button className="mt-4" onClick={() => void resumesQuery.refetch()}>
            Retry
          </Button>
        </div>
      </main>
    );
  }

  const data = resumesQuery.data;
  const activeResume = data.activeResume;
  const history = data.versionHistory?.length ? data.versionHistory : data.resumes;

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Resume</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Resume Manager
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              Upload, replace, download, and track the resume versions you use
              across job applications.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/job-seeker/profile">
              <Button variant="outline">View Profile</Button>
            </Link>
            <Link href="/job-seeker/profile/edit">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </div>
        </section>

        {statusMessage ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {statusMessage}
          </div>
        ) : null}
        {submitError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {submitError}
          </div>
        ) : null}

        <input
          ref={replaceInputRef}
          type="file"
          accept={RESUME_ALLOWED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(event) => {
            void handleReplacementFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <div className="space-y-6">
            <ResumeUploadDropzone
              isUploading={uploadMutation.isPending}
              submitError={uploadMutation.isError ? submitError : undefined}
              onUpload={(formData) => uploadMutation.mutate(formData)}
            />
            <CurrentResumeCard
              resume={activeResume}
              isReplacing={replaceMutation.isPending}
              isDeleting={deleteMutation.isPending}
              onView={handleView}
              onDownload={(resume) => void handleDownload(resume)}
              onReplace={(resume) => {
                setResumeToReplace(resume);
                replaceInputRef.current?.click();
              }}
              onDelete={setResumeToDelete}
            />
          </div>

          <aside className="space-y-6">
            <ResumePerformanceCard data={data} />
            <ResumeVersionHistory resumes={history} onRestore={handleRestore} />
          </aside>
        </section>

        <ResumeTipsGrid insights={data.insights} />

        <footer className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 pt-5 text-sm text-muted">
          <Link href="/job-seeker/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <Link href="/job-seeker/profile" className="hover:text-primary">
            Profile
          </Link>
          <Link href="/profile/applications" className="hover:text-primary">
            Applied Jobs
          </Link>
          <Link href="/profile/saved-jobs" className="hover:text-primary">
            Saved Jobs
          </Link>
        </footer>
      </div>

      <ResumeDeleteConfirmModal
        open={Boolean(resumeToDelete)}
        resume={resumeToDelete}
        isDeleting={deleteMutation.isPending}
        onClose={() => setResumeToDelete(undefined)}
        onConfirm={() => {
          if (resumeToDelete) {
            deleteMutation.mutate(resumeToDelete._id);
          }
        }}
      />
    </main>
  );
}
