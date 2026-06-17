import { remoteJobCategories, remoteQuickFilters } from "@/lib/remote-jobs-data";

export default function RemoteJobsFilters() {
  return (
    <aside
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
      aria-labelledby="remote-filters-heading"
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
        <h2 id="remote-filters-heading" className="text-base font-semibold">
          Quick filters
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
            Remote type
          </legend>
          <div className="mt-3 space-y-3">
            {remoteQuickFilters.map((option) => (
              <label
                key={option.label}
                className="flex cursor-pointer items-center justify-between gap-3 text-sm text-muted"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <input
                    type="checkbox"
                    name={option.label}
                    defaultChecked={option.checked}
                    className="size-4 border-slate-300 text-primary focus:ring-primary/30"
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

        <fieldset>
          <legend className="text-sm font-semibold text-foreground">
            Salary range
          </legend>
          <div className="mt-3 rounded-md border border-slate-200 bg-background p-4 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span>$50K</span>
              <span>$180K+</span>
            </div>
            <label className="mt-4 block">
              <span className="sr-only">Minimum remote salary</span>
              <input
                type="range"
                name="salary"
                min="50000"
                max="180000"
                defaultValue="90000"
                className="w-full accent-primary"
              />
            </label>
            <p className="mt-2 text-xs text-muted">
              Showing remote jobs from $90K and above
            </p>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-foreground">
            Job category
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {remoteJobCategories.map((category, index) => (
              <label
                key={category}
                className="cursor-pointer rounded-md border border-slate-200 bg-background px-3 py-2 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary has-checked:border-primary has-checked:bg-blue-50 has-checked:text-primary dark:border-slate-700 dark:has-checked:bg-blue-950/30"
              >
                <input
                  type="checkbox"
                  name="category"
                  value={category}
                  defaultChecked={index < 2}
                  className="sr-only"
                />
                {category}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  );
}
