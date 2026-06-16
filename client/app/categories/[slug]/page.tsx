import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoryJobsHero from "@/components/category-jobs/CategoryJobsHero";
import CategoryJobsPageContent from "@/components/category-jobs/CategoryJobsPageContent";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import {
  categoryJobsData,
  getCategoryJobsData,
} from "@/lib/category-jobs-data";

type CategoryJobsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(categoryJobsData).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryJobsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getCategoryJobsData(slug);

  if (!data) {
    return {
      title: "Category jobs not found | CareerBridge",
    };
  }

  return {
    title: `${data.title} | CareerBridge`,
    description: data.description,
  };
}

export default async function CategoryJobsPage({
  params,
}: CategoryJobsPageProps) {
  const { slug } = await params;
  const data = getCategoryJobsData(slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <PublicNavbar />
      <main className="bg-background">
        <CategoryJobsHero data={data} />
        <CategoryJobsPageContent data={data} />
      </main>
      <PublicFooter />
    </>
  );
}
