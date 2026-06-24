"use client";

import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";
import { BriefcaseBusiness, Plus, Trash2 } from "lucide-react";

import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import type { JobSeekerProfileFormValues } from "@/lib/validations/job-seeker-profile.schema";

type EditExperienceSectionProps = {
  form: UseFormReturn<JobSeekerProfileFormValues>;
};

const employmentTypeOptions = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Contract", value: "Contract" },
  { label: "Freelance", value: "Freelance" },
  { label: "Internship", value: "Internship" },
];

export default function EditExperienceSection({ form }: EditExperienceSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const experienceValues = useWatch({
    control: form.control,
    name: "experience",
  });

  const errors = form.formState.errors.experience;

  return (
    <Card
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Work experience</h2>
            <p className="mt-1 text-sm text-muted">Add roles, companies, and responsibilities.</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Plus className="size-4" aria-hidden="true" />}
            onClick={() =>
              append({
                title: "",
                company: "",
                employmentType: "",
                startDate: "",
                endDate: "",
                currentlyWorking: false,
                location: "",
                description: "",
              })
            }
          >
            Add Experience
          </Button>
        </div>
      }
    >
      {fields.length ? (
        <div className="space-y-5">
          {fields.map((field, index) => {
            const currentlyWorking = experienceValues?.[index]?.currentlyWorking;
            const itemErrors = errors?.[index];

            return (
              <section
                key={field.id}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <BriefcaseBusiness className="size-4 text-primary" aria-hidden="true" />
                    Experience {index + 1}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-700 hover:bg-red-50 hover:text-red-800"
                    leftIcon={<Trash2 className="size-4" aria-hidden="true" />}
                    onClick={() => remove(index)}
                  >
                    Delete
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Job title"
                    error={itemErrors?.title?.message}
                    {...form.register(`experience.${index}.title`)}
                  />
                  <Input
                    label="Company name"
                    error={itemErrors?.company?.message}
                    {...form.register(`experience.${index}.company`)}
                  />
                  <Select
                    label="Employment type"
                    placeholder="Select type"
                    options={employmentTypeOptions}
                    {...form.register(`experience.${index}.employmentType`)}
                  />
                  <Input
                    label="Location"
                    placeholder="Dhaka, Bangladesh"
                    {...form.register(`experience.${index}.location`)}
                  />
                  <Input
                    label="Start date"
                    type="date"
                    {...form.register(`experience.${index}.startDate`)}
                  />
                  <Input
                    label="End date"
                    type="date"
                    disabled={Boolean(currentlyWorking)}
                    error={itemErrors?.endDate?.message}
                    {...form.register(`experience.${index}.endDate`)}
                  />
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                    {...form.register(`experience.${index}.currentlyWorking`)}
                  />
                  I currently work here
                </label>

                <Textarea
                  wrapperClassName="mt-4"
                  label="Responsibilities"
                  placeholder="Describe your responsibilities, impact, and tools used."
                  {...form.register(`experience.${index}.description`)}
                />
              </section>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-muted">
          <p>No experience added yet.</p>
          <Button
            className="mt-3"
            size="sm"
            onClick={() =>
              append({
                title: "",
                company: "",
                employmentType: "",
                startDate: "",
                endDate: "",
                currentlyWorking: false,
                location: "",
                description: "",
              })
            }
          >
            Add Experience
          </Button>
        </div>
      )}
    </Card>
  );
}
