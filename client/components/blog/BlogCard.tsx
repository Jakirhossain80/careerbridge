import Link from "next/link";
import { ArrowRight, CalendarDays, Eye, Timer } from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { BlogArticle } from "@/lib/blog-data";

type BlogCardProps = {
  article: BlogArticle;
};

export default function BlogCard({ article }: BlogCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:border-slate-700">
      <Link href={`/blog/${article.slug}`} className="block bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.featuredImage}
          alt=""
          className="h-48 w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{article.category}</Badge>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            {article.readingTime}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-semibold leading-7 text-foreground">
          <Link
            href={`/blog/${article.slug}`}
            className="transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted">
          {article.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {article.publishedAt}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5" aria-hidden="true" />
            {article.reads}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Timer className="size-3.5" aria-hidden="true" />
            {article.readingTime}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.authorAvatar}
              alt=""
              className="size-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-muted">
              {article.author}
            </span>
          </div>
          <Link
            href={`/blog/${article.slug}`}
            aria-label={`Read ${article.title}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-blue-700"
          >
            Read
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export type { BlogCardProps };
