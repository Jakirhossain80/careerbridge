import { Building2, MapPin, UsersRound } from "lucide-react";

import { Input, Select } from "@/components/ui";

const industryOptions = [
  { label: "Software & Cloud", value: "Software & Cloud" },
  { label: "Fintech", value: "Fintech" },
  { label: "Healthcare Technology", value: "Healthcare Technology" },
  { label: "Education Technology", value: "Education Technology" },
  { label: "Ecommerce", value: "Ecommerce" },
  { label: "Professional Services", value: "Professional Services" },
];

const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001+ employees",
];

type CompanyKeyDetailsFormProps = {
  industry: string;
  companySize: string;
  headquarters: string;
  onIndustryChange: (value: string) => void;
  onCompanySizeChange: (value: string) => void;
  onHeadquartersChange: (value: string) => void;
};

export default function CompanyKeyDetailsForm({
  industry,
  companySize,
  headquarters,
  onIndustryChange,
  onCompanySizeChange,
  onHeadquartersChange,
}: CompanyKeyDetailsFormProps) {
  return (
    <section
      aria-labelledby="company-key-details-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2
          id="company-key-details-heading"
          className="text-lg font-semibold text-foreground"
        >
          Key details
        </h2>
        <p className="mt-1 text-sm text-muted">
          Help candidates quickly understand your company category, scale, and
          location.
        </p>
      </div>

      <div className="mt-5 space-y-6">
        <Select
          label={
            <span className="inline-flex items-center gap-2">
              <Building2 className="size-4 text-primary" aria-hidden="true" />
              Industry
            </span>
          }
          name="industry"
          value={industry}
          options={industryOptions}
          onChange={(event) => onIndustryChange(event.target.value)}
          required
        />

        <fieldset>
          <legend className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <UsersRound className="size-4 text-primary" aria-hidden="true" />
            Company size
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {companySizes.map((size) => (
              <label
                key={size}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                  companySize === size
                    ? "border-primary bg-blue-50 text-primary dark:bg-blue-950/30"
                    : "border-slate-200 bg-background text-muted hover:border-slate-300 hover:text-foreground dark:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="companySize"
                  value={size}
                  checked={companySize === size}
                  onChange={(event) => onCompanySizeChange(event.target.value)}
                  className="size-4 border-slate-300 text-primary focus:ring-primary/30"
                />
                <span className="font-medium">{size}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Input
          label={
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              Location
            </span>
          }
          name="headquarters"
          value={headquarters}
          onChange={(event) => onHeadquartersChange(event.target.value)}
          autoComplete="address-level2"
          required
        />
      </div>
    </section>
  );
}
