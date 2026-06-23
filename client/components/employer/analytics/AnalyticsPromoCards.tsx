import { Lightbulb, Target, UsersRound } from "lucide-react";

import { Card } from "@/components/ui";

const insights = [
  {
    title: "Improve conversion",
    description:
      "Roles with clear salary ranges and remote options are converting above the account average.",
    icon: Target,
  },
  {
    title: "Prioritize interviews",
    description:
      "Shortlisted candidates are responding fastest when interviews are scheduled within three days.",
    icon: UsersRound,
  },
  {
    title: "Hiring signal",
    description:
      "Engineering and product roles are driving the strongest applicant quality this period.",
    icon: Lightbulb,
  },
];

export default function AnalyticsPromoCards() {
  return (
    <section
      aria-labelledby="analytics-insights-heading"
      className="grid gap-4 lg:grid-cols-3"
    >
      <h2 id="analytics-insights-heading" className="sr-only">
        Analytics insights
      </h2>
      {insights.map((insight) => {
        const Icon = insight.icon;

        return (
          <Card key={insight.title} contentClassName="p-5">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{insight.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {insight.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
