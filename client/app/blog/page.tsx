import type { Metadata } from "next";

import BlogCategoryFilter from "@/components/blog/BlogCategoryFilter";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogHero from "@/components/blog/BlogHero";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogSidebar from "@/components/blog/BlogSidebar";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import {
  blogArticles,
  blogCategories,
  popularBlogArticles,
  type BlogCategory,
} from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog | CareerBridge",
  description:
    "Read CareerBridge articles on career tips, resumes, interviews, networking, remote work, workplace culture, hiring trends, and recruitment insights.",
};

const articlesPerPage = 6;

type BlogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  value: string | string[] | undefined,
  fallback = "",
) {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

function getActiveCategory(value: string): BlogCategory {
  return blogCategories.includes(value as BlogCategory)
    ? (value as BlogCategory)
    : "All Articles";
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = (await searchParams) ?? {};
  const query = getParamValue(params.q).trim();
  const activeCategory = getActiveCategory(getParamValue(params.category));
  const page = Math.max(Number(getParamValue(params.page, "1")) || 1, 1);
  const featuredArticle =
    blogArticles.find((article) => article.featuredStatus === "featured") ??
    blogArticles[0];

  const filteredArticles = blogArticles
    .filter((article) => article.id !== featuredArticle.id)
    .filter((article) => {
      const matchesCategory =
        activeCategory === "All Articles" || article.category === activeCategory;
      const searchableText = [
        article.title,
        article.excerpt,
        article.category,
        article.author,
        ...article.tags,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery =
        query.length === 0 || searchableText.includes(query.toLowerCase());

      return matchesCategory && matchesQuery;
    });

  const totalPages = Math.max(Math.ceil(filteredArticles.length / articlesPerPage), 1);
  const currentPage = Math.min(page, totalPages);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage,
  );

  return (
    <>
      <PublicNavbar />
      <main>
        <BlogHero />

        <section className="-mt-8 bg-transparent px-6">
          <div className="mx-auto w-full max-w-6xl">
            <BlogSearch key={query} initialQuery={query} />
          </div>
        </section>

        <section className="bg-background px-6 py-12">
          <div className="mx-auto w-full max-w-6xl">
            <BlogCategoryFilter
              categories={blogCategories}
              activeCategory={activeCategory}
              query={query}
            />

            <div className="mt-8">
              <FeaturedBlogCard article={featuredArticle} />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
              <div>
                <BlogGrid
                  articles={paginatedArticles}
                  totalArticles={filteredArticles.length}
                />
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>

              <BlogSidebar popularArticles={popularBlogArticles} />
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
