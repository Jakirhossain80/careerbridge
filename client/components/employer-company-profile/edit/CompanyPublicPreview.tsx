import Image from "next/image";
import { Building2, ExternalLink, MapPin, UsersRound } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { CompanyProfileFormData } from "@/components/employer-company-profile/edit/EditCompanyProfileForm";

type CompanyPublicPreviewProps = {
  company: CompanyProfileFormData;
};

export default function CompanyPublicPreview({
  company,
}: CompanyPublicPreviewProps) {
  return (
    <Card
      className="xl:sticky xl:top-24"
      header={
        <div>
          <h2 className="text-lg font-semibold text-foreground">Public preview</h2>
          <p className="mt-1 text-sm text-muted">
            A compact view of how candidates will read this profile.
          </p>
        </div>
      }
      contentClassName="p-0"
    >
      <div className="relative h-32 bg-slate-900">
        <Image
          src={company.bannerUrl}
          alt=""
          fill
          sizes="360px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/85 via-blue-700/65 to-emerald-500/70" />
      </div>

      <div className="px-5 pb-5">
        <div className="-mt-10 flex size-20 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-blue-50 shadow-sm ring-4 ring-surface dark:border-slate-700 dark:bg-slate-800">
          <Image
            src={company.logoUrl}
            alt={`${company.companyName} logo`}
            width={80}
            height={80}
            className="size-full object-cover"
          />
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-foreground">
              {company.companyName}
            </h3>
            <Badge variant="primary">{company.hiringStatus}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{company.tagline}</p>
        </div>

        <dl className="mt-5 space-y-3 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-slate-400" aria-hidden="true" />
            <dt className="sr-only">Industry</dt>
            <dd>{company.industry}</dd>
          </div>
          <div className="flex items-center gap-2">
            <UsersRound className="size-4 text-slate-400" aria-hidden="true" />
            <dt className="sr-only">Company size</dt>
            <dd>{company.companySize}</dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-slate-400" aria-hidden="true" />
            <dt className="sr-only">Headquarters</dt>
            <dd>{company.headquarters}</dd>
          </div>
        </dl>

        <div className="mt-5 rounded-lg bg-background p-4">
          <h4 className="text-sm font-semibold text-foreground">About</h4>
          <p className="mt-2 line-clamp-5 text-sm leading-6 text-muted">
            {company.about}
          </p>
        </div>

        <a
          href={company.website}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
        >
          Company Website
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </Card>
  );
}
