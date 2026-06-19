import type { BlogArticle } from "@/lib/blog-data";

import BlogCard from "./BlogCard";

type BlogGridProps = {
  articles: BlogArticle[];
  totalArticles: number;
};

export default function BlogGrid({ articles, totalArticles }: BlogGridProps) {
  return (
    <section aria-labelledby="blog-results-heading">
      <div className="mb-5 rounded-lg border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-700">
        <h2 id="blog-results-heading" className="text-lg font-semibold">
          Latest articles
        </h2>
        <p className="mt-1 text-sm text-muted">
          Showing {articles.length} of {totalArticles} career resources
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-surface p-8 text-center dark:border-slate-700">
          <h3 className="text-lg font-semibold text-foreground">
            No articles found
          </h3>
          <p className="mt-2 text-sm text-muted">
            Try a different keyword or category to find more CareerBridge
            resources.
          </p>
        </div>
      )}
    </section>
  );
}

export type { BlogGridProps };
