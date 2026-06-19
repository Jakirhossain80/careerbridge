import { ListChecks } from "lucide-react";

import { termsSections } from "@/lib/terms-data";

export default function TermsSidebar() {
  return (
    <nav
      aria-labelledby="terms-toc-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950/50">
          <ListChecks className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2
            id="terms-toc-heading"
            className="text-base font-bold text-foreground"
          >
            Table of contents
          </h2>
          <p className="text-sm text-muted">{termsSections.length} sections</p>
        </div>
      </div>

      <ol className="mt-5 space-y-1">
        {termsSections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-blue-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:hover:bg-blue-950/40"
            >
              <span
                className="w-5 shrink-0 text-xs font-bold text-slate-400 group-hover:text-primary dark:text-slate-500"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
