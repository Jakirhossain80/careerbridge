import type { BlogArticle } from "@/lib/blog-data";

import BlogNewsletterCTA from "./BlogNewsletterCTA";
import BlogResourceCTA from "./BlogResourceCTA";
import PopularArticles from "./PopularArticles";

type BlogSidebarProps = {
  popularArticles: BlogArticle[];
};

export default function BlogSidebar({ popularArticles }: BlogSidebarProps) {
  return (
    <aside className="grid gap-5 lg:sticky lg:top-6" aria-label="Blog sidebar">
      <PopularArticles articles={popularArticles} />
      <BlogNewsletterCTA />
      <BlogResourceCTA />
    </aside>
  );
}

export type { BlogSidebarProps };
