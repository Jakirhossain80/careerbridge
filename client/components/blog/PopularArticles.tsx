import Link from "next/link";

import type { BlogArticle } from "@/lib/blog-data";

type PopularArticlesProps = {
  articles: BlogArticle[];
};

export default function PopularArticles({ articles }: PopularArticlesProps) {
  return (
    <section
      aria-labelledby="popular-articles-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <h2 id="popular-articles-heading" className="text-lg font-semibold">
        Popular articles
      </h2>
      <div className="mt-4 grid gap-4">
        {articles.map((article, index) => (
          <article key={article.id} className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-sm font-bold text-primary dark:bg-blue-950">
              {index + 1}
            </span>
            <div>
              <h3 className="text-sm font-semibold leading-5 text-foreground">
                <Link
                  href={`/blog/${article.slug}`}
                  className="transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {article.title}
                </Link>
              </h3>
              <p className="mt-1 text-xs font-medium text-muted">
                {article.reads} reads · {article.readingTime}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export type { PopularArticlesProps };
