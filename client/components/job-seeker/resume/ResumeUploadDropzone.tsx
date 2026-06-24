"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, Upload } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { useForm } from "react-hook-form";

import { Button, Card } from "@/components/ui";
import {
  RESUME_ALLOWED_EXTENSIONS,
  RESUME_MAX_FILE_SIZE,
  resumeUploadSchema,
  type ResumeUploadFormValues,
} from "@/lib/validations/resume.schema";

type ResumeUploadDropzoneProps = {
  isUploading?: boolean;
  submitError?: string;
  onUpload: (formData: FormData) => void;
};

function formatMaxSize(bytes: number) {
  return `${bytes / 1024 / 1024}MB`;
}

export default function ResumeUploadDropzone({
  isUploading = false,
  submitError,
  onUpload,
}: ResumeUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<ResumeUploadFormValues>({
    resolver: zodResolver(resumeUploadSchema),
  });

  function buildFormData(file: File) {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);
    formData.append("fileSize", String(file.size));
    return formData;
  }

  async function handleFile(file?: File) {
    if (!file) {
      return;
    }

    setSelectedFileName(file.name);
    form.setValue("file", file, { shouldValidate: true });
    const isValid = await form.trigger("file");

    if (isValid) {
      onUpload(buildFormData(file));
      form.reset();
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  }

  const fileError = form.formState.errors.file?.message;

  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Upload new resume
          </h2>
          <p className="mt-1 text-sm text-muted">
            Add a PDF, DOC, or DOCX file for quick apply workflows.
          </p>
        </div>
      }
      contentClassName="p-5"
    >
      <input
        ref={inputRef}
        type="file"
        accept={RESUME_ALLOWED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed px-5 py-9 text-center transition ${
          isDragging
            ? "border-primary bg-blue-50"
            : "border-slate-300 bg-slate-50 hover:border-primary/70 hover:bg-blue-50/40"
        }`}
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileUp className="size-7" aria-hidden="true" />
        </div>
        <p className="mt-4 text-base font-semibold text-foreground">
          Drag and drop your resume here
        </p>
        <p className="mt-2 text-sm text-muted">
          {selectedFileName || `Supported formats: PDF, DOC, DOCX up to ${formatMaxSize(RESUME_MAX_FILE_SIZE)}`}
        </p>
        <Button
          className="mt-5"
          isLoading={isUploading}
          leftIcon={<Upload className="size-4" aria-hidden="true" />}
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Upload Resume
        </Button>
      </div>

      {fileError ? <p className="mt-3 text-sm text-red-600">{fileError}</p> : null}
      {submitError ? (
        <p className="mt-3 text-sm text-red-600">{submitError}</p>
      ) : null}
    </Card>
  );
}
