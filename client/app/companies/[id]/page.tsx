import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CompanyAboutCard from "@/components/company-details/CompanyAboutCard";
import CompanyHero from "@/components/company-details/CompanyHero";
import OpenPositions from "@/components/company-details/OpenPositions";
import TalentPoolCard from "@/components/company-details/TalentPoolCard";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { companyDetails } from "@/lib/company-details-data";
import { getPublicCompanyDetails } from "@/services/public-companies.service";

type CompanyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return companyDetails.map((company) => ({ id: company.id }));
}

export async function generateMetadata({
  params,
}: CompanyDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const company = await getPublicCompanyDetails(id);

  if (!company) {
    return {
      title: "Company not found | CareerBridge",
    };
  }

  return {
    title: `${company.name} | CareerBridge`,
    description: `${company.name} company profile, open roles, company information, and talent pool on CareerBridge.`,
  };
}

export default async function CompanyDetailsPage({
  params,
}: CompanyDetailsPageProps) {
  const { id } = await params;
  const company = await getPublicCompanyDetails(id);

  if (!company) {
    notFound();
  }

  return (
    <>
      <PublicNavbar />
      <main className="bg-background pb-16">
        <CompanyHero company={company} />

        <section className="px-6 py-10">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
            <div className="grid gap-6">
              <CompanyAboutCard company={company} />
              <OpenPositions company={company} />
            </div>

            <TalentPoolCard company={company} />
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
