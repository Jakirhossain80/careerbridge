import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Globe2,
  MapPin,
  Share2,
} from "lucide-react";

import { Card } from "@/components/ui";
import type { CompanyDetails } from "@/lib/company-details-data";

type CompanyAboutCardProps = {
  company: CompanyDetails;
};

const infoIcons = {
  Website: Globe2,
  Industry: Building2,
  Headquarters: MapPin,
};

export default function CompanyAboutCard({ company }: CompanyAboutCardProps) {
  return (
    <Card contentClassName="p-6">
      <section aria-labelledby="about-company-heading">
        <h2
          id="about-company-heading"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          About company
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-6 text-muted">
          {company.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h3 className="text-base font-bold tracking-tight text-foreground">
            Company information
          </h3>

          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {company.information.map((item) => {
              const Icon = infoIcons[item.label as keyof typeof infoIcons] ?? Building2;

              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-slate-200 bg-background p-4 dark:border-slate-700"
                >
                  <dt className="flex items-center gap-2 text-sm font-medium text-muted">
                    <Icon className="size-4 text-slate-400" aria-hidden="true" />
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-foreground">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-1 transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {item.value}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-5">
            <h3 className="text-sm font-bold tracking-tight text-foreground">
              Social links
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {company.socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
                >
                  <Share2 className="size-4" aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Card>
  );
}
