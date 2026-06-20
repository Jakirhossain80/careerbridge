import { AtSign, Mail } from "lucide-react";

import type { BlogArticle } from "@/lib/blog-data";

type BlogAuthorCardProps = {
  article: BlogArticle;
};

export default function BlogAuthorCard({ article }: BlogAuthorCardProps) {
  return (
    <section
      aria-labelledby="author-bio-heading"
      className="mt-10 rounded-lg border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.authorAvatar}
          alt={`${article.author} avatar`}
          className="size-20 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Written by
          </p>
          <h2 id="author-bio-heading" className="mt-1 text-2xl font-bold">
            {article.author}
          </h2>
          <p className="mt-1 text-sm font-semibold text-muted">
            {article.authorTitle}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">{article.authorBio}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={`Email ${article.author}`}
            className="flex size-10 items-center justify-center rounded-md border border-slate-200 text-muted transition hover:border-primary/40 hover:text-primary dark:border-slate-700"
          >
            <Mail className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`${article.author} profile`}
            className="flex size-10 items-center justify-center rounded-md border border-slate-200 text-muted transition hover:border-primary/40 hover:text-primary dark:border-slate-700"
          >
            <AtSign className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export type { BlogAuthorCardProps };
