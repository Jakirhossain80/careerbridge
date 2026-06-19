"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import SectionHeader from "@/components/home/SectionHeader";
import type { FAQCategory, FAQItem as FAQItemType } from "@/lib/faq-data";
import { faqCategories } from "@/lib/faq-data";

import FAQAccordion from "./FAQAccordion";
import FAQCategoryList from "./FAQCategoryList";
import FAQSearch from "./FAQSearch";

type FAQExplorerProps = {
  items: FAQItemType[];
};

export default function FAQExplorer({ items }: FAQExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | "All">(
    "All",
  );

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.displayOrder - b.displayOrder),
    [items],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortedItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [item.category, item.question, item.answer]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory, sortedItems]);

  const featuredItems = sortedItems.filter((item) => item.featured).slice(0, 4);

  const categoryCounts = useMemo(() => {
    const counts = faqCategories.reduce(
      (accumulator, category) => ({
        ...accumulator,
        [category]: sortedItems.filter((item) => item.category === category)
          .length,
      }),
      { All: sortedItems.length } as Record<FAQCategory | "All", number>,
    );

    return counts;
  }, [sortedItems]);

  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Frequently asked questions"
          title="Search by topic or browse by category"
          description="Choose a category, type a keyword, or open a featured question to find the answer you need."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-24">
            <FAQCategoryList
              categories={faqCategories}
              selectedCategory={selectedCategory}
              counts={categoryCounts}
              onSelectCategory={setSelectedCategory}
            />
          </aside>

          <div className="space-y-8">
            <FAQSearch
              value={query}
              onChange={setQuery}
              resultCount={filteredItems.length}
            />

            {featuredItems.length > 0 ? (
              <section aria-labelledby="featured-faq-heading">
                <div className="flex items-center gap-2">
                  <Star className="size-5 fill-accent text-accent" aria-hidden="true" />
                  <h2
                    id="featured-faq-heading"
                    className="text-xl font-bold tracking-tight text-foreground"
                  >
                    Featured questions
                  </h2>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {featuredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="rounded-lg border border-slate-200 bg-surface p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
                      onClick={() => {
                        setSelectedCategory(item.category);
                        setQuery(item.question);
                      }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {item.category}
                      </span>
                      <span className="mt-2 block text-sm font-semibold leading-6 text-foreground">
                        {item.question}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section aria-labelledby="faq-list-heading">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    id="faq-list-heading"
                    className="text-xl font-bold tracking-tight text-foreground"
                  >
                    FAQ answers
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Showing {filteredItems.length} answer
                    {filteredItems.length === 1 ? "" : "s"} for{" "}
                    {selectedCategory === "All"
                      ? "all categories"
                      : selectedCategory}
                    .
                  </p>
                </div>
                {(query || selectedCategory !== "All") && (
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
                    onClick={() => {
                      setQuery("");
                      setSelectedCategory("All");
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <FAQAccordion items={filteredItems} />
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { FAQExplorerProps };
