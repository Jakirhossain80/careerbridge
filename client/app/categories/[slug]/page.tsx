import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, ChevronRight } from "lucide-react";

import CategoryJobsPageContent from "@/components/category-jobs/CategoryJobsPageContent";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";

type CategoryJobsPageProps = { params: Promise<{ slug: string }> };

const toCategoryName = (slug: string) => slug.split("-").filter(Boolean).map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");

export async function generateMetadata({ params }: CategoryJobsPageProps): Promise<Metadata> {
  const category = toCategoryName((await params).slug);
  return { title: `${category} Jobs | CareerBridge`, description: `Browse verified ${category} jobs on CareerBridge.` };
}

export default async function CategoryJobsPage({ params }: CategoryJobsPageProps) {
  const category = toCategoryName((await params).slug);
  return <><PublicNavbar /><main className="bg-background"><section className="bg-slate-950 px-6 py-16 text-white sm:py-20"><div className="mx-auto w-full max-w-6xl"><nav aria-label="Breadcrumb"><ol className="flex items-center gap-2 text-sm text-slate-200"><li><Link href="/">Home</Link></li><li aria-hidden="true"><ChevronRight className="size-4" /></li><li><Link href="/categories">Categories</Link></li><li aria-hidden="true"><ChevronRight className="size-4" /></li><li aria-current="page">{category}</li></ol></nav><p className="mt-10 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-sm font-semibold ring-1 ring-white/20"><BriefcaseBusiness className="size-4" aria-hidden="true" />{category}</p><h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{category} jobs</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">Browse current, verified opportunities in {category}.</p></div></section><CategoryJobsPageContent category={category} /></main><PublicFooter /></>;
}
