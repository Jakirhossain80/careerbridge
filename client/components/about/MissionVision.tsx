import { Compass, Target } from "lucide-react";

import { mission, vision } from "@/lib/about-data";

const items = [
  { ...mission, icon: Target },
  { ...vision, icon: Compass },
];

export default function MissionVision() {
  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-lg border border-slate-200 bg-background p-6 shadow-sm dark:border-slate-700 md:p-8"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                {item.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
