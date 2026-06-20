import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { BlogArticle } from "@/lib/blog-data";

type BlogPostNavigationProps = {
  previousArticle?: BlogArticle;
  nextArticle?: BlogArticle;
};

export default function BlogPostNavigation({
  previousArticle,
  nextArticle,
}: BlogPostNavigationProps) {
  if (!previousArticle && !nextArticle) {
    return null;
  }

  return (
    <nav
      aria-label="Previous and next articles"
      className="mt-10 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2 dark:border-slate-700"
    >
      {previousArticle ? (
        <Link
          href={`/blog/${previousArticle.slug}`}
          className="group rounded-lg border border-slate-200 bg-surface p-5 shadow-sm transition hover:border-primary/40 dark:border-slate-700"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <ArrowLeft className="size-4 transition group-hover:-translate-x-1" />
            Previous article
          </span>
          <span className="mt-3 block text-lg font-semibold leading-6 text-foreground group-hover:text-primary">
            {previousArticle.title}
          </span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}

      {nextArticle ? (
        <Link
          href={`/blog/${nextArticle.slug}`}
          className="group rounded-lg border border-slate-200 bg-surface p-5 text-left shadow-sm transition hover:border-primary/40 sm:text-right dark:border-slate-700"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
            Next article
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </span>
          <span className="mt-3 block text-lg font-semibold leading-6 text-foreground group-hover:text-primary">
            {nextArticle.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

export type { BlogPostNavigationProps };
