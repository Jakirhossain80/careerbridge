import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { BlogArticle } from "@/lib/blog-data";

type RelatedArticlesProps = {
  articles: BlogArticle[];
};

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-background px-6 py-14" aria-labelledby="related-heading">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              Keep reading
            </p>
            <h2 id="related-heading" className="mt-2 text-3xl font-bold">
              Related articles
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
          >
            View all articles
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:border-slate-700"
            >
              <Link href={`/blog/${article.slug}`} className="block bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.featuredImage}
                  alt=""
                  className="h-44 w-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <Badge variant="neutral">{article.category}</Badge>
                <h3 className="mt-4 text-xl font-semibold leading-7">
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
                <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {article.publishedAt}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {article.readingTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export type { RelatedArticlesProps };
