import { Lightbulb } from "lucide-react";

import { Card } from "@/components/ui";

const tips = [
  "Tailor your resume summary to React, TypeScript, and product UI delivery.",
  "Include links to shipped interfaces, design system work, or performance improvements.",
  "Keep your availability and salary expectations clear before submitting.",
];

export default function ApplicationTipsCard() {
  return (
    <Card contentClassName="p-6">
      <aside aria-labelledby="application-tips-heading">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <Lightbulb className="size-5" aria-hidden="true" />
          </span>
          <h2
            id="application-tips-heading"
            className="text-lg font-bold tracking-tight text-foreground"
          >
            Application tips
          </h2>
        </div>
        <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted">
          {tips.map((tip) => (
            <li key={tip} className="border-l-2 border-primary/30 pl-3">
              {tip}
            </li>
          ))}
        </ul>
      </aside>
    </Card>
  );
}
