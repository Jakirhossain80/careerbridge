"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

import { Button, Card, Input } from "@/components/ui";
import type { JobSeekerProfileFormValues } from "@/lib/validations/job-seeker-profile.schema";

type EditEducationSectionProps = {
  form: UseFormReturn<JobSeekerProfileFormValues>;
};

export default function EditEducationSection({ form }: EditEducationSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const errors = form.formState.errors.education;

  return (
    <Card
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Education</h2>
            <p className="mt-1 text-sm text-muted">Degrees, institutions, and graduation year.</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Plus className="size-4" aria-hidden="true" />}
            onClick={() =>
              append({
                degree: "",
                institution: "",
                fieldOfStudy: "",
                graduationYear: "",
              })
            }
          >
            Add Education
          </Button>
        </div>
      }
    >
      {fields.length ? (
        <div className="space-y-5">
          {fields.map((field, index) => {
            const itemErrors = errors?.[index];

            return (
              <section
                key={field.id}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <GraduationCap className="size-4 text-emerald-700" aria-hidden="true" />
                    Education {index + 1}
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
                    label="Degree"
                    error={itemErrors?.degree?.message}
                    {...form.register(`education.${index}.degree`)}
                  />
                  <Input
                    label="Institution"
                    error={itemErrors?.institution?.message}
                    {...form.register(`education.${index}.institution`)}
                  />
                  <Input
                    label="Field of study"
                    {...form.register(`education.${index}.fieldOfStudy`)}
                  />
                  <Input
                    label="Graduation year"
                    inputMode="numeric"
                    placeholder="2026"
                    {...form.register(`education.${index}.graduationYear`)}
                  />
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-muted">
          <p>No education added yet.</p>
          <Button
            className="mt-3"
            size="sm"
            onClick={() =>
              append({
                degree: "",
                institution: "",
                fieldOfStudy: "",
                graduationYear: "",
              })
            }
          >
            Add Education
          </Button>
        </div>
      )}
    </Card>
  );
}
