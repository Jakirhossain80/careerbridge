import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogArticleContent from "@/components/blog-details/BlogArticleContent";
import BlogArticleHeader from "@/components/blog-details/BlogArticleHeader";
import BlogAuthorCard from "@/components/blog-details/BlogAuthorCard";
import BlogDetailsSidebar from "@/components/blog-details/BlogDetailsSidebar";
import BlogPostNavigation from "@/components/blog-details/BlogPostNavigation";
import BlogShareSidebar from "@/components/blog-details/BlogShareSidebar";
import ReadingProgressBar from "@/components/blog-details/ReadingProgressBar";
import RelatedArticles from "@/components/blog-details/RelatedArticles";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import {
  blogArticles,
  getBlogArticleBySlug,
  getBlogTableOfContents,
  getRelatedBlogArticles,
} from "@/lib/blog-data";

type BlogDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article not found | CareerBridge",
    };
  }

  return {
    title: `${article.title} | CareerBridge`,
    description: article.excerpt,
  };
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const tableOfContents = getBlogTableOfContents(article);
  const relatedArticles = getRelatedBlogArticles(article);
  const previousArticle = article.previousSlug
    ? getBlogArticleBySlug(article.previousSlug)
    : undefined;
  const nextArticle = article.nextSlug
    ? getBlogArticleBySlug(article.nextSlug)
    : undefined;

  return (
    <>
      <ReadingProgressBar />
      <PublicNavbar />
      <main>
        <BlogArticleHeader article={article} />

        <section className="bg-background px-6 pb-12 pt-4">
          <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[72px_minmax(0,760px)_320px] xl:items-start">
            <BlogShareSidebar title={article.title} />
            <div className="rounded-lg border border-slate-200 bg-surface p-6 shadow-sm sm:p-8 dark:border-slate-700">
              <BlogArticleContent article={article} />
              <BlogAuthorCard article={article} />
              <BlogPostNavigation
                previousArticle={previousArticle}
                nextArticle={nextArticle}
              />
            </div>
            <BlogDetailsSidebar tableOfContents={tableOfContents} />
          </div>
        </section>

        <RelatedArticles articles={relatedArticles} />
      </main>
      <PublicFooter />
    </>
  );
}
