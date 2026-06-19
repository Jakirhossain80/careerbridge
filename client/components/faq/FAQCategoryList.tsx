"use client";

import type { FAQCategory } from "@/lib/faq-data";

type FAQCategoryListProps = {
  categories: readonly FAQCategory[];
  selectedCategory: FAQCategory | "All";
  counts: Record<FAQCategory | "All", number>;
  onSelectCategory: (category: FAQCategory | "All") => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function FAQCategoryList({
  categories,
  selectedCategory,
  counts,
  onSelectCategory,
}: FAQCategoryListProps) {
  const options = ["All", ...categories] as const;

  return (
    <nav
      className="rounded-lg border border-slate-200 bg-surface p-3 shadow-sm dark:border-slate-700"
      aria-label="FAQ categories"
    >
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {options.map((category) => {
          const selected = selectedCategory === category;

          return (
            <li key={category} className="shrink-0 lg:shrink">
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/30",
                  selected
                    ? "bg-primary text-white shadow-sm shadow-blue-900/10"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white",
                )}
                onClick={() => onSelectCategory(category)}
                aria-current={selected ? "true" : undefined}
              >
                <span>{category}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    selected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-muted dark:bg-slate-800",
                  )}
                >
                  {counts[category]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export type { FAQCategoryListProps };
