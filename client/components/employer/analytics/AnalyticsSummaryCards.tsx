import AnalyticsMetricCard from "@/components/employer/analytics/AnalyticsMetricCard";
import type { AnalyticsMetric } from "@/types/analytics.types";

type AnalyticsSummaryCardsProps = {
  metrics: AnalyticsMetric[];
};

export default function AnalyticsSummaryCards({
  metrics,
}: AnalyticsSummaryCardsProps) {
  return (
    <section aria-labelledby="analytics-summary-heading">
      <h2 id="analytics-summary-heading" className="sr-only">
        Analytics summary
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <AnalyticsMetricCard key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}
