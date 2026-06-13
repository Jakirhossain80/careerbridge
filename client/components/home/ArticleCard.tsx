import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { BlogArticle } from "@/lib/home-data";

type ArticleCardProps = {
  article: BlogArticle;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:border-slate-700">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {article.category}
        </span>
        <span className="text-muted">{article.readTime}</span>
      </div>

      <h3 className="mt-5 text-xl font-semibold leading-7 text-foreground">
        <Link
          href={article.href}
          className="transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">
        {article.excerpt}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
        <span className="text-sm font-medium text-muted">
          {article.publishedAt}
        </span>
        <Link
          href={article.href}
          aria-label={`Read ${article.title}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
        >
          Read
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export type { ArticleCardProps };
