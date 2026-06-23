"use client";

import { Camera } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button, Card, Input } from "@/components/ui";
import type { EmployerSettingsFormValues } from "@/lib/validations/employer-settings.schema";

export default function ProfilePhotoCard() {
  const { register, watch } = useFormContext<EmployerSettingsFormValues>();
  const fullName = watch("account.fullName");
  const avatar = watch("account.avatar");
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold">Profile Photo</h2>
          <p className="mt-1 text-sm text-muted">Add a public recruiter avatar URL.</p>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex size-28 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-2xl font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="size-full object-cover" />
          ) : (
            initials || "CB"
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          leftIcon={<Camera className="size-4" aria-hidden="true" />}
        >
          Upload Photo
        </Button>
        <p className="mt-2 text-xs leading-5 text-muted">
          Upload wiring is intentionally left as a safe placeholder until media storage is connected.
        </p>
      </div>

      <Input
        label="Avatar URL"
        wrapperClassName="mt-5"
        placeholder="https://example.com/avatar.jpg"
        {...register("account.avatar")}
      />
    </Card>
  );
}

