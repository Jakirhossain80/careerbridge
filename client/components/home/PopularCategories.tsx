import { categories } from "@/lib/home-data";

import CategoryCard from "./CategoryCard";
import SectionHeader from "./SectionHeader";

export default function PopularCategories() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Popular categories"
          title="Explore jobs by career path"
          description="Start with the fields employers are hiring for most, then narrow by skills, location, and work style."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
