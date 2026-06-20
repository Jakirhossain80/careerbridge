import { Bookmark, Heart, MessageCircle } from "lucide-react";

import type { BlogArticle } from "@/lib/blog-data";

type BlogArticleContentProps = {
  article: BlogArticle;
};

export default function BlogArticleContent({ article }: BlogArticleContentProps) {
  return (
    <article className="min-w-0" aria-labelledby="article-title">
      <div className="grid gap-6 text-base leading-8 text-slate-700 dark:text-slate-200">
        {article.content.map((block, index) => {
          if (block.type === "paragraph") {
            return <p key={index}>{block.text}</p>;
          }

          if (block.type === "heading") {
            return (
              <h2
                key={block.id}
                id={block.id}
                className="scroll-mt-24 pt-4 text-2xl font-bold leading-tight text-foreground"
              >
                {block.title}
              </h2>
            );
          }

          if (block.type === "list") {
            return (
              <ul key={index} className="grid gap-3 pl-1">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-3 size-2 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === "quote") {
            return (
              <blockquote
                key={index}
                className="rounded-lg border-l-4 border-primary bg-blue-50 p-6 text-xl font-semibold leading-8 text-slate-900 dark:bg-blue-950/40 dark:text-white"
              >
                <p>&ldquo;{block.quote}&rdquo;</p>
                {block.attribution ? (
                  <footer className="mt-3 text-sm font-medium text-muted">
                    {block.attribution}
                  </footer>
                ) : null}
              </blockquote>
            );
          }

          return (
            <aside
              key={index}
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40"
              aria-label={block.title}
            >
              <p className="text-sm font-bold uppercase tracking-wide text-accent">
                {block.title}
              </p>
              <p className="mt-2 text-base leading-7 text-slate-700 dark:text-slate-200">
                {block.text}
              </p>
            </aside>
          );
        })}
      </div>

      <section className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-700">
        <h2 className="sr-only">Article tags and engagement</h2>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <a
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-slate-200 bg-surface px-3 py-1.5 text-sm font-semibold text-muted transition hover:border-primary/40 hover:text-primary dark:border-slate-700"
            >
              #{tag}
            </a>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <Heart className="size-4" aria-hidden="true" />
            Like article
            <span className="font-bold">{article.likes.toLocaleString()}</span>
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-300 bg-surface px-4 text-sm font-semibold text-foreground transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            <Bookmark className="size-4" aria-hidden="true" />
            Save
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-300 bg-surface px-4 text-sm font-semibold text-foreground transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Discuss
          </button>
        </div>
      </section>
    </article>
  );
}

export type { BlogArticleContentProps };
