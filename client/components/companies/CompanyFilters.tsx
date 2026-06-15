import { companyFilterGroups } from "@/lib/companies-data";

export default function CompanyFilters() {
  return (
    <aside
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
      aria-labelledby="company-filters-heading"
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2 id="company-filters-heading" className="text-base font-semibold">
          Filters
        </h2>
        <button
          type="button"
          className="text-sm font-semibold text-primary transition hover:text-blue-700"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {companyFilterGroups.map((group) => (
          <fieldset key={group.title}>
            <legend className="text-sm font-semibold text-foreground">
              {group.title}
            </legend>
            <div className="mt-3 space-y-3">
              {group.options.map((option) => (
                <label
                  key={option.label}
                  className="flex cursor-pointer items-center justify-between gap-3 text-sm text-muted"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked={option.checked}
                      className="size-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                    />
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {option.count}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </aside>
  );
}
