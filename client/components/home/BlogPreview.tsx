import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { blogArticles } from "@/lib/home-data";

import ArticleCard from "./ArticleCard";
import SectionHeader from "./SectionHeader";

export default function BlogPreview() {
  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Career articles"
          title="Practical guidance for your next move"
          description="Read concise advice on applications, profiles, interviews, remote work, and hiring signals."
          action={
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
            >
              Visit blog
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {blogArticles.map((article) => (
            <ArticleCard key={article.title} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
