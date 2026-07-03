"use client";

import { type ChangeEvent, useId } from "react";
import { Camera, UserRound } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";

import { Badge, Button, Card, Input } from "@/components/ui";
import type { JobSeekerProfileFormValues } from "@/lib/validations/job-seeker-profile.schema";

type EditProfilePhotoCardProps = {
  avatar?: string;
  fullName?: string;
  completion?: number;
  error?: string;
  isUploading?: boolean;
  register: UseFormRegister<JobSeekerProfileFormValues>;
  onAvatarUpload: (file: File) => void;
};

function getInitials(name?: string) {
  return (name || "Job Seeker")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function EditProfilePhotoCard({
  avatar,
  fullName,
  completion = 0,
  error,
  isUploading = false,
  register,
  onAvatarUpload,
}: EditProfilePhotoCardProps) {
  const fileInputId = useId();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      onAvatarUpload(file);
    }

    event.target.value = "";
  }

  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">Profile photo</h2>
          <p className="mt-1 text-sm text-muted">Use a professional image URL.</p>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-3xl font-bold text-primary">
          {avatar ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${avatar})` }}
              aria-label={`${fullName || "Candidate"} avatar preview`}
            />
          ) : (
            <span>{getInitials(fullName)}</span>
          )}
          <span className="absolute bottom-2 right-2 inline-flex size-8 items-center justify-center rounded-md bg-primary text-white shadow-sm">
            <Camera className="size-4" aria-hidden="true" />
          </span>
        </div>

        <h3 className="mt-4 font-semibold text-foreground">
          {fullName || "Complete your profile"}
        </h3>
        <Badge className="mt-2" variant={completion >= 80 ? "success" : "warning"}>
          {completion}% complete
        </Badge>

        <div className="mt-5 w-full">
          <Input
            label="Avatar URL"
            placeholder="https://example.com/avatar.jpg"
            error={error}
            {...register("avatar")}
          />
        </div>

        <div className="mt-3 w-full">
          <input
            id={fileInputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            isLoading={isUploading}
            leftIcon={<Camera className="size-4" aria-hidden="true" />}
            onClick={() => document.getElementById(fileInputId)?.click()}
          >
            Upload Photo
          </Button>
        </div>

        <div className="mt-5 flex w-full items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-left">
          <UserRound className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm leading-6 text-blue-900">
            A clear profile photo and complete summary can improve employer trust.
          </p>
        </div>
      </div>
    </Card>
  );
}
