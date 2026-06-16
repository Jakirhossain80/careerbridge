import { Building2, MapPin, Search, SlidersHorizontal, Sparkles, Tag } from "lucide-react";

const searchFields = [
  {
    label: "Job title",
    name: "title",
    placeholder: "Product designer",
    icon: Search,
  },
  {
    label: "Company name",
    name: "company",
    placeholder: "Company",
    icon: Building2,
  },
  {
    label: "Skill",
    name: "skill",
    placeholder: "React, SQL",
    icon: Sparkles,
  },
  {
    label: "Keyword",
    name: "keyword",
    placeholder: "Keyword",
    icon: Tag,
  },
  {
    label: "Location",
    name: "location",
    placeholder: "City or remote",
    icon: MapPin,
  },
];

export default function JobsSearchBar() {
  return (
    <form
      role="search"
      aria-label="Search jobs"
      className="rounded-lg border border-slate-200 bg-surface p-3 shadow-sm dark:border-slate-700"
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.15fr_1fr_0.9fr_0.9fr_1fr_auto]">
        {searchFields.map((field) => {
          const Icon = field.icon;

          return (
            <label key={field.name} className="relative block">
              <span className="sr-only">{field.label}</span>
              <Icon
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                name={field.name}
                placeholder={field.placeholder}
                className="h-12 w-full rounded-md border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
            </label>
          );
        })}

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 md:col-span-2 xl:col-span-1"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Search jobs
        </button>
      </div>
    </form>
  );
}
