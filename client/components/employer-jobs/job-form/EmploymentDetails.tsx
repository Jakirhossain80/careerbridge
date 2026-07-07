import { Input, Select } from "@/components/ui";
import { currencyOptions } from "@/constants/currency-options";
import {
  hiringUrgencies,
  jobTypes,
  workModes,
} from "@/lib/employer-job-form-data";
import type { EmployerJobFormData } from "@/types/employer-job";

type EmploymentDetailsProps = {
  formData: EmployerJobFormData;
  onFieldChange: <Key extends keyof EmployerJobFormData>(
    key: Key,
    value: EmployerJobFormData[Key],
  ) => void;
};

export default function EmploymentDetails({
  formData,
  onFieldChange,
}: EmploymentDetailsProps) {
  return (
    <section
      aria-labelledby="employment-details-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2
          id="employment-details-heading"
          className="text-lg font-semibold text-foreground"
        >
          Employment Details
        </h2>
        <p className="mt-1 text-sm text-muted">
          Define how and where the team will work.
        </p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Select
          label="Job type"
          name="jobType"
          value={formData.jobType}
          onChange={(event) => onFieldChange("jobType", event.target.value)}
          options={jobTypes.map((type) => ({ label: type, value: type }))}
          required
        />

        <fieldset className="space-y-2">
          <legend className="block text-sm font-medium text-foreground">
            Work mode <span className="text-red-600">*</span>
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {workModes.map((mode) => (
              <label
                key={mode}
                className={`flex h-12 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-semibold transition ${
                  formData.workMode === mode
                    ? "border-primary bg-primary text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-primary/50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="workMode"
                  value={mode}
                  checked={formData.workMode === mode}
                  onChange={(event) =>
                    onFieldChange("workMode", event.target.value)
                  }
                  className="sr-only"
                  required
                />
                {mode}
              </label>
            ))}
          </div>
        </fieldset>

        <Input
          label="Salary minimum"
          name="salaryMin"
          type="number"
          min={0}
          value={formData.salaryMin}
          onChange={(event) =>
            onFieldChange("salaryMin", Number(event.target.value))
          }
          required
        />
        <Input
          label="Salary maximum"
          name="salaryMax"
          type="number"
          min={0}
          value={formData.salaryMax}
          onChange={(event) =>
            onFieldChange("salaryMax", Number(event.target.value))
          }
          required
        />
        <Select
          label="Currency"
          name="currency"
          value={formData.currency}
          onChange={(event) => onFieldChange("currency", event.target.value)}
          options={currencyOptions.map((currency) => ({
            label: currency.label,
            value: currency.value,
          }))}
          required
        />
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={(event) => onFieldChange("location", event.target.value)}
          placeholder="City, state or Remote"
          required
        />
        <Input
          label="Vacancies"
          name="vacancies"
          type="number"
          min={1}
          value={formData.vacancies}
          onChange={(event) =>
            onFieldChange("vacancies", Number(event.target.value))
          }
          required
        />
        <Select
          label="Hiring urgency"
          name="hiringUrgency"
          value={formData.hiringUrgency}
          onChange={(event) =>
            onFieldChange("hiringUrgency", event.target.value)
          }
          options={hiringUrgencies.map((urgency) => ({
            label: urgency,
            value: urgency,
          }))}
        />
      </div>
    </section>
  );
}
