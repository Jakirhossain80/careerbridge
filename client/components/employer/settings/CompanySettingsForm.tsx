"use client";

import { useFormContext } from "react-hook-form";

import { Card, Input, Select } from "@/components/ui";
import type { EmployerSettingsFormValues } from "@/lib/validations/employer-settings.schema";

const companySizeOptions = [
  { label: "1-10 employees", value: "1-10" },
  { label: "11-50 employees", value: "11-50" },
  { label: "51-200 employees", value: "51-200" },
  { label: "201-500 employees", value: "201-500" },
  { label: "501-1000 employees", value: "501-1000" },
  { label: "1000+ employees", value: "1000+" },
];

export default function CompanySettingsForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EmployerSettingsFormValues>();

  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold">Company Settings</h2>
          <p className="mt-1 text-sm text-muted">
            Keep company information consistent across job posts and public pages.
          </p>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Company name"
          required
          error={errors.company?.companyName?.message}
          {...register("company.companyName")}
        />
        <Input
          label="Company email"
          type="email"
          required
          error={errors.company?.companyEmail?.message}
          {...register("company.companyEmail")}
        />
        <Input
          label="Company phone"
          type="tel"
          error={errors.company?.companyPhone?.message}
          {...register("company.companyPhone")}
        />
        <Input
          label="Company website"
          placeholder="https://company.com"
          error={errors.company?.website?.message}
          {...register("company.website")}
        />
        <Input
          label="Company location"
          error={errors.company?.location?.message}
          {...register("company.location")}
        />
        <Input
          label="Industry"
          error={errors.company?.industry?.message}
          {...register("company.industry")}
        />
        <Select
          label="Company size"
          options={companySizeOptions}
          error={errors.company?.companySize?.message}
          {...register("company.companySize")}
        />
      </div>
    </Card>
  );
}

