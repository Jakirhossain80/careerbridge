import Link from "next/link";

import type { BlogCategory } from "@/lib/blog-data";

type BlogCategoryFilterProps = {
  categories: BlogCategory[];
  activeCategory: BlogCategory;
  query?: string;
};

function getCategoryHref(category: BlogCategory, query?: string) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (category !== "All Articles") {
    params.set("category", category);
  }

  const queryString = params.toString();
  return queryString ? `/blog?${queryString}` : "/blog";
}

export default function BlogCategoryFilter({
  categories,
  activeCategory,
  query,
}: BlogCategoryFilterProps) {
  return (
    <nav aria-label="Blog categories" className="overflow-x-auto">
      <div className="flex min-w-max gap-2 pb-1">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <Link
              key={category}
              href={getCategoryHref(category, query)}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm shadow-blue-900/10"
                  : "inline-flex h-10 items-center rounded-md border border-slate-200 bg-surface px-4 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary dark:border-slate-700 dark:text-slate-200"
              }
            >
              {category}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export type { BlogCategoryFilterProps };
