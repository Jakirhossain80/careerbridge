import { Textarea } from "@/components/ui";
import type { EmployerJobFormData } from "@/types/employer-job";

type JobContentSectionProps = {
  formData: EmployerJobFormData;
  onFieldChange: <Key extends keyof EmployerJobFormData>(
    key: Key,
    value: EmployerJobFormData[Key],
  ) => void;
};

export default function JobContentSection({
  formData,
  onFieldChange,
}: JobContentSectionProps) {
  return (
    <section
      aria-labelledby="job-content-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2 id="job-content-heading" className="text-lg font-semibold text-foreground">
          Job Content
        </h2>
        <p className="mt-1 text-sm text-muted">
          Explain the work, expectations, and reasons to apply.
        </p>
      </div>

      <div className="mt-5 grid gap-5">
        <Textarea
          label="Job description"
          name="description"
          value={formData.description}
          onChange={(event) => onFieldChange("description", event.target.value)}
          placeholder="Summarize the role and the team."
          required
        />
        <Textarea
          label="Responsibilities"
          name="responsibilities"
          value={formData.responsibilities}
          onChange={(event) =>
            onFieldChange("responsibilities", event.target.value)
          }
          placeholder="List the core responsibilities."
          required
        />
        <Textarea
          label="Requirements"
          name="requirements"
          value={formData.requirements}
          onChange={(event) => onFieldChange("requirements", event.target.value)}
          placeholder="List required qualifications and experience."
        />
        <Textarea
          label="Benefits"
          name="benefits"
          value={formData.benefits}
          onChange={(event) => onFieldChange("benefits", event.target.value)}
          placeholder="Share benefits, perks, and culture highlights."
        />
      </div>
    </section>
  );
}
