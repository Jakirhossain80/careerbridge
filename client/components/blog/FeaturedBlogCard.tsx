import Link from "next/link";
import { ArrowRight, CalendarDays, Eye, Timer } from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { BlogArticle } from "@/lib/blog-data";

type FeaturedBlogCardProps = {
  article: BlogArticle;
};

export default function FeaturedBlogCard({ article }: FeaturedBlogCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-sm dark:border-slate-700">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <Link href={`/blog/${article.slug}`} className="block bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.featuredImage}
            alt=""
            className="h-72 w-full object-cover lg:h-full"
          />
        </Link>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary">{article.category}</Badge>
            <span className="text-sm font-semibold text-accent">
              Featured article
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-foreground">
            <Link
              href={`/blog/${article.slug}`}
              className="transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {article.title}
            </Link>
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            {article.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden="true" />
              {article.publishedAt}
            </span>
            <span className="inline-flex items-center gap-2">
              <Timer className="size-4" aria-hidden="true" />
              {article.readingTime}
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye className="size-4" aria-hidden="true" />
              {article.reads} reads
            </span>
          </div>

          <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.authorAvatar}
              alt=""
              className="size-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {article.author}
              </p>
              <Link
                href={`/blog/${article.slug}`}
                className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
              >
                Read article
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export type { FeaturedBlogCardProps };
