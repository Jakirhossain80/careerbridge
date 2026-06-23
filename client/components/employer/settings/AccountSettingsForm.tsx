"use client";

import { useFormContext } from "react-hook-form";

import { Card, Input } from "@/components/ui";
import type { EmployerSettingsFormValues } from "@/lib/validations/employer-settings.schema";

export default function AccountSettingsForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EmployerSettingsFormValues>();

  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <p className="mt-1 text-sm text-muted">
            Manage the primary employer contact tied to this workspace.
          </p>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Employer name"
          required
          error={errors.account?.fullName?.message}
          {...register("account.fullName")}
        />
        <Input
          label="Email address"
          type="email"
          required
          error={errors.account?.email?.message}
          {...register("account.email")}
        />
        <Input
          label="Phone number"
          type="tel"
          error={errors.account?.phone?.message}
          {...register("account.phone")}
        />
        <Input
          label="Job title/designation"
          error={errors.account?.designation?.message}
          {...register("account.designation")}
        />
      </div>
    </Card>
  );
}

