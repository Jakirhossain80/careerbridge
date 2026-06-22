import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui";
import type { CompanyProfile } from "@/lib/employer-company-profile-data";

type CompanyHighlightsProps = {
  company: CompanyProfile;
};

export default function CompanyHighlights({ company }: CompanyHighlightsProps) {
  return (
    <section aria-labelledby="recent-highlights-heading">
      <div className="mb-4">
        <h2
          id="recent-highlights-heading"
          className="text-xl font-semibold text-foreground"
        >
          Recent Highlights
        </h2>
        <p className="mt-1 text-sm text-muted">
          Updates that keep candidates informed about company momentum.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {company.highlights.map((highlight) => (
          <Card key={highlight.id} contentClassName="p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <CalendarDays className="size-4" aria-hidden="true" />
              <time>{highlight.date}</time>
            </div>
            <h3 className="mt-4 font-semibold text-foreground">
              {highlight.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              {highlight.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
