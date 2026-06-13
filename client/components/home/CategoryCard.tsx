import {
  BarChart3,
  BriefcaseBusiness,
  Code2,
  Headphones,
  Megaphone,
  Palette,
} from "lucide-react";

import type { Category } from "@/lib/home-data";

const categoryIcons = {
  code: Code2,
  chart: BarChart3,
  briefcase: BriefcaseBusiness,
  design: Palette,
  support: Headphones,
  megaphone: Megaphone,
};

type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category.icon];

  return (
    <article className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:border-slate-700">
      <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">
        {category.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        {category.description}
      </p>
      <p className="mt-4 text-sm font-semibold text-accent">
        {category.openRoles}
      </p>
    </article>
  );
}

export type { CategoryCardProps };
