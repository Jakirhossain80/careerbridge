import type { CareerCategory } from "@/lib/categories-data";

import CategoryCard from "./CategoryCard";

type FeaturedCategoriesProps = {
  categories: CareerCategory[];
};

export default function FeaturedCategories({
  categories,
}: FeaturedCategoriesProps) {
  return (
    <section className="bg-surface px-6 py-14 dark:bg-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Featured category cards
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Focused paths with the strongest hiring momentum
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            These categories combine strong job volume, broad skill demand, and
            active employers across CareerBridge.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              variant="featured"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
