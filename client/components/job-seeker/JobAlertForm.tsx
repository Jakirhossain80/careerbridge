"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Input, Select } from "@/components/ui";
import {
  jobAlertSchema,
  type JobAlertFormValues,
} from "@/lib/validations/job-alert.schema";
import type { JobAlert } from "@/types/job-alert.types";

type JobAlertFormProps = {
  initialValue?: JobAlert;
  isSubmitting?: boolean;
  onSubmit: (values: JobAlertFormValues) => void;
};

export default function JobAlertForm({
  initialValue,
  isSubmitting,
  onSubmit,
}: JobAlertFormProps) {
  const form = useForm<JobAlertFormValues>({
    resolver: zodResolver(jobAlertSchema),
    defaultValues: {
      title: initialValue?.title ?? "",
      keyword: initialValue?.keyword ?? "",
      location: initialValue?.location ?? "",
      category: initialValue?.category ?? "",
      jobType: initialValue?.jobType ?? "",
      workMode: initialValue?.workMode ?? "",
      frequency: initialValue?.frequency ?? "daily",
      isActive: initialValue?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Input label="Alert title" {...form.register("title")} error={form.formState.errors.title?.message} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Keyword" {...form.register("keyword")} />
        <Input label="Location" {...form.register("location")} />
        <Input label="Category" {...form.register("category")} />
        <Input label="Job type" {...form.register("jobType")} />
        <Input label="Work mode" {...form.register("workMode")} />
        <Select
          label="Frequency"
          {...form.register("frequency")}
          options={[
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
          ]}
        />
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" className="size-4" {...form.register("isActive")} />
        Active
      </label>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {initialValue ? "Update alert" : "Create alert"}
        </Button>
      </div>
    </form>
  );
}
