import type { Metadata } from "next";

import CategoriesCTA from "@/components/categories/CategoriesCTA";
import CategoriesHeader from "@/components/categories/CategoriesHeader";
import CategoriesSearch from "@/components/categories/CategoriesSearch";
import CategoryGrid from "@/components/categories/CategoryGrid";
import FeaturedCategories from "@/components/categories/FeaturedCategories";
import PopularCategories from "@/components/categories/PopularCategories";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import {
  categories,
  featuredCategories,
  popularCategories,
} from "@/lib/categories-data";

export const metadata: Metadata = {
  title: "Categories | CareerBridge",
  description:
    "Browse CareerBridge job categories, popular career paths, featured hiring fields, and filtered job listings by category.",
};

export default function CategoriesPage() {
  return (
    <>
      <PublicNavbar />
      <main>
        <CategoriesHeader />
        <CategoriesSearch categories={categories} />
        <PopularCategories categories={popularCategories} />
        <FeaturedCategories categories={featuredCategories} />
        <CategoryGrid categories={categories} />
        <CategoriesCTA />
      </main>
      <PublicFooter />
    </>
  );
}
