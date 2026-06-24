import { Lightbulb, ListChecks, Target, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui";
import type { ResumeInsightTone, ResumeManagerInsight } from "@/types/resume.types";

type ResumeTipsGridProps = {
  insights?: ResumeManagerInsight[];
};

const toneClasses: Record<ResumeInsightTone, string> = {
  primary: "bg-blue-50 text-primary",
  secondary: "bg-emerald-50 text-emerald-700",
  tertiary: "bg-amber-50 text-amber-700",
  neutral: "bg-slate-100 text-slate-700",
};

const icons: LucideIcon[] = [Target, ListChecks, Lightbulb];

const fallbackInsights: ResumeManagerInsight[] = [
  {
    title: "Tailor keywords",
    description:
      "Match your resume language to the job title, required skills, and domain.",
    tone: "primary",
  },
  {
    title: "Lead with outcomes",
    description:
      "Recruiters scan faster when bullet points show business impact clearly.",
    tone: "secondary",
  },
  {
    title: "Keep formatting simple",
    description:
      "Use a clean layout that parsing systems can read without losing sections.",
    tone: "neutral",
  },
];

export default function ResumeTipsGrid({ insights }: ResumeTipsGridProps) {
  const tips = insights?.length ? insights : fallbackInsights;

  return (
    <section aria-labelledby="resume-tips-heading" className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-primary">Optimization</p>
        <h2
          id="resume-tips-heading"
          className="mt-1 text-xl font-bold tracking-tight text-foreground"
        >
          Resume improvement tips
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tips.map((tip, index) => {
          const Icon = icons[index % icons.length];
          const tone = tip.tone ?? "neutral";

          return (
            <Card key={tip.title} contentClassName="p-5">
              <div className={`flex size-10 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {tip.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {tip.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
