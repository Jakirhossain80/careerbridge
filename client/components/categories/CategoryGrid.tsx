import type { CareerCategory } from "@/lib/categories-data";

import CategoryCard from "./CategoryCard";

type CategoryGridProps = {
  categories: CareerCategory[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="bg-background px-6 py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            All categories
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Explore every hiring category
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Each category is ready to map to filtered job listings through a
            stable slug such as development, data-analytics, or people-hr.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
