import { Card } from "@/components/ui";
import type { JobSummary } from "@/lib/job-details-data";

type JobSummaryCardsProps = {
  items: JobSummary[];
};

export default function JobSummaryCards({ items }: JobSummaryCardsProps) {
  return (
    <section aria-labelledby="job-summary-heading">
      <h2 id="job-summary-heading" className="sr-only">
        Job summary
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.label} contentClassName="p-5">
            <p className="text-sm font-medium text-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {item.value}
            </p>
            <p className="mt-1 text-sm text-muted">{item.supportingText}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
