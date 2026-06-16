import { jobsFilterGroups } from "@/lib/jobs-data";

export default function JobsFilters() {
  return (
    <aside
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
      aria-labelledby="jobs-filters-heading"
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2 id="jobs-filters-heading" className="text-base font-semibold">
          Filters
        </h2>
        <button
          type="button"
          className="text-sm font-semibold text-primary transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 space-y-6">
        <fieldset>
          <legend className="text-sm font-semibold text-foreground">
            Salary range
          </legend>
          <div className="mt-3 rounded-md border border-slate-200 bg-background p-4 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span>$30K</span>
              <span>$150K+</span>
            </div>
            <label className="mt-4 block">
              <span className="sr-only">Minimum salary</span>
              <input
                type="range"
                name="salary"
                min="30000"
                max="150000"
                defaultValue="90000"
                className="w-full accent-primary"
              />
            </label>
            <p className="mt-2 text-xs text-muted">
              Showing jobs from $90K and above
            </p>
          </div>
        </fieldset>

        {jobsFilterGroups.map((group) => (
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
                      type={group.type ?? "checkbox"}
                      name={group.type === "radio" ? group.title : option.label}
                      defaultChecked={option.checked}
                      className="size-4 border-slate-300 text-primary focus:ring-primary/30"
                    />
                    <span className="truncate">{option.label}</span>
                  </span>
                  {option.count ? (
                    <span className="shrink-0 text-xs text-slate-400">
                      {option.count}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </aside>
  );
}
