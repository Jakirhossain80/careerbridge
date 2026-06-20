import Link from "next/link";
import { CalendarDays, ChevronRight, Clock3, Heart, UserRound } from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { BlogArticle } from "@/lib/blog-data";

type BlogArticleHeaderProps = {
  article: BlogArticle;
};

export default function BlogArticleHeader({ article }: BlogArticleHeaderProps) {
  return (
    <header className="bg-background px-6 pb-8 pt-8 sm:pt-10">
      <div className="mx-auto w-full max-w-5xl">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
            <li>
              <Link href="/" className="transition hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="size-4" aria-hidden="true" />
            </li>
            <li>
              <Link href="/blog" className="transition hover:text-primary">
                Blog
              </Link>
            </li>
            <li>
              <ChevronRight className="size-4" aria-hidden="true" />
            </li>
            <li className="text-foreground" aria-current="page">
              {article.category}
            </li>
          </ol>
        </nav>

        <div className="mt-8">
          <Badge variant="primary">{article.category}</Badge>
          <h1
            id="article-title"
            className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-foreground sm:text-5xl"
          >
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            {article.excerpt}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-slate-200 py-5 text-sm text-muted dark:border-slate-700">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.authorAvatar}
              alt={`${article.author} avatar`}
              className="size-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-foreground">{article.author}</p>
              <p>{article.authorTitle}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            {article.publishedAt}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-4" aria-hidden="true" />
            {article.readingTime}
          </span>
          <span className="inline-flex items-center gap-2">
            <Heart className="size-4" aria-hidden="true" />
            {article.likes.toLocaleString()} likes
          </span>
          <span className="inline-flex items-center gap-2">
            <UserRound className="size-4" aria-hidden="true" />
            Updated {article.updatedAt}
          </span>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.featuredImage}
            alt=""
            className="h-[260px] w-full object-cover sm:h-[420px]"
          />
        </div>
      </div>
    </header>
  );
}

export type { BlogArticleHeaderProps };
