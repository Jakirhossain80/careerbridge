import Link from "next/link";
import { ExternalLink, Mail, Phone } from "lucide-react";

import { Card } from "@/components/ui";
import type { CompanyProfile } from "@/lib/employer-company-profile-data";

type CompanyContactCardProps = {
  company: CompanyProfile;
};

export default function CompanyContactCard({ company }: CompanyContactCardProps) {
  return (
    <Card
      header={<h2 className="text-lg font-semibold text-foreground">Contact information</h2>}
    >
      <address className="not-italic">
        <div className="space-y-4 text-sm">
          <Link
            href={`mailto:${company.contactEmail}`}
            className="flex items-center gap-3 text-muted transition hover:text-primary"
          >
            <Mail className="size-4 shrink-0" aria-hidden="true" />
            <span>{company.contactEmail}</span>
          </Link>
          <Link
            href={`tel:${company.phone.replaceAll(" ", "")}`}
            className="flex items-center gap-3 text-muted transition hover:text-primary"
          >
            <Phone className="size-4 shrink-0" aria-hidden="true" />
            <span>{company.phone}</span>
          </Link>
        </div>
      </address>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-foreground">Social links</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {company.socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-muted transition hover:border-primary/40 hover:text-primary dark:border-slate-700"
            >
              {link.label}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
