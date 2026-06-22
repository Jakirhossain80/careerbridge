import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui";
import type { CompanyProfile } from "@/lib/employer-company-profile-data";

type CompanyAboutCardProps = {
  company: CompanyProfile;
};

export default function CompanyAboutCard({ company }: CompanyAboutCardProps) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold text-foreground">About company</h2>
          <p className="mt-1 text-sm text-muted">
            The profile story candidates see when they evaluate open roles.
          </p>
        </div>
      }
    >
      <p className="text-sm leading-6 text-muted">{company.about}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="benefits-heading">
          <h3 id="benefits-heading" className="font-semibold text-foreground">
            Benefits
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {company.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="culture-heading">
          <h3 id="culture-heading" className="font-semibold text-foreground">
            Culture
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {company.culture.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}
