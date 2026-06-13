import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CompanyCard } from "@/components/cards";
import { topCompanies } from "@/lib/home-data";

import SectionHeader from "./SectionHeader";

export default function TopCompanies() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Top companies"
          title="Discover trusted employers"
          description="Explore verified companies with active openings, clear hiring needs, and teams growing across the region."
          action={
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700"
            >
              View companies
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {topCompanies.map((company) => (
            <CompanyCard key={company.id} {...company} />
          ))}
        </div>
      </div>
    </section>
  );
}
