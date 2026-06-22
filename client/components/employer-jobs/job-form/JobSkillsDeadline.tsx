import { Plus, X } from "lucide-react";

import { Button, Input, Select } from "@/components/ui";
import { applicationMethods } from "@/lib/employer-job-form-data";
import type { EmployerJobFormData } from "@/types/employer-job";

type JobSkillsDeadlineProps = {
  formData: EmployerJobFormData;
  skillInput: string;
  onSkillInputChange: (value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
  onFieldChange: <Key extends keyof EmployerJobFormData>(
    key: Key,
    value: EmployerJobFormData[Key],
  ) => void;
};

export default function JobSkillsDeadline({
  formData,
  skillInput,
  onSkillInputChange,
  onAddSkill,
  onRemoveSkill,
  onFieldChange,
}: JobSkillsDeadlineProps) {
  return (
    <section
      aria-labelledby="job-skills-deadline-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2
          id="job-skills-deadline-heading"
          className="text-lg font-semibold text-foreground"
        >
          Skills and Deadline
        </h2>
        <p className="mt-1 text-sm text-muted">
          Add searchable skills and application instructions.
        </p>
      </div>

      <div className="mt-5 grid gap-5">
        <div className="space-y-3">
          <label
            htmlFor="requiredSkill"
            className="block text-sm font-medium text-foreground"
          >
            Required skills
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="requiredSkill"
              name="requiredSkill"
              value={skillInput}
              onChange={(event) => onSkillInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onAddSkill();
                }
              }}
              placeholder="Add skill, e.g. React"
              wrapperClassName="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={onAddSkill}
              leftIcon={<Plus className="size-4" aria-hidden="true" />}
              className="sm:mt-8"
            >
              Add skill
            </Button>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Selected skills">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-primary dark:bg-blue-500/10 dark:text-blue-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  className="rounded-full p-0.5 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:bg-blue-400/20"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Application deadline"
            name="applicationDeadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={(event) =>
              onFieldChange("applicationDeadline", event.target.value)
            }
            required
          />
          <Select
            label="Application method"
            name="applicationMethod"
            value={formData.applicationMethod}
            onChange={(event) =>
              onFieldChange("applicationMethod", event.target.value)
            }
            options={applicationMethods.map((method) => ({
              label: method,
              value: method,
            }))}
          />
          <Input
            label="External application URL"
            name="externalApplicationUrl"
            type="url"
            value={formData.externalApplicationUrl}
            onChange={(event) =>
              onFieldChange("externalApplicationUrl", event.target.value)
            }
            placeholder="https://company.com/careers/job"
            wrapperClassName="md:col-span-2"
          />
        </div>
      </div>
    </section>
  );
}
