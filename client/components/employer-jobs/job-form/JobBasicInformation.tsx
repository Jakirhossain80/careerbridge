import { Input, Select } from "@/components/ui";
import {
  educationLevels,
  experienceLevels,
  jobCategories,
} from "@/lib/employer-job-form-data";
import type { EmployerJobFormData } from "@/types/employer-job";

type JobBasicInformationProps = {
  formData: EmployerJobFormData;
  onFieldChange: <Key extends keyof EmployerJobFormData>(
    key: Key,
    value: EmployerJobFormData[Key],
  ) => void;
};

export default function JobBasicInformation({
  formData,
  onFieldChange,
}: JobBasicInformationProps) {
  return (
    <section
      aria-labelledby="job-basic-information-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2
          id="job-basic-information-heading"
          className="text-lg font-semibold text-foreground"
        >
          Basic Information
        </h2>
        <p className="mt-1 text-sm text-muted">
          Start with the role details candidates scan first.
        </p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Input
          label="Job title"
          name="title"
          value={formData.title}
          onChange={(event) => onFieldChange("title", event.target.value)}
          placeholder="e.g. Senior Frontend Engineer"
          required
          wrapperClassName="md:col-span-2"
        />
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={(event) => onFieldChange("category", event.target.value)}
          options={jobCategories.map((category) => ({
            label: category,
            value: category,
          }))}
          required
        />
        <Select
          label="Experience level"
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={(event) =>
            onFieldChange("experienceLevel", event.target.value)
          }
          options={experienceLevels.map((level) => ({
            label: level,
            value: level,
          }))}
          required
        />
        <Select
          label="Education level"
          name="educationLevel"
          value={formData.educationLevel}
          onChange={(event) =>
            onFieldChange("educationLevel", event.target.value)
          }
          options={educationLevels.map((level) => ({
            label: level,
            value: level,
          }))}
          wrapperClassName="md:col-span-2"
        />
      </div>
    </section>
  );
}
