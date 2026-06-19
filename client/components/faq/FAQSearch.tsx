"use client";

import SearchBar from "@/components/ui/SearchBar";

type FAQSearchProps = {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
};

export default function FAQSearch({
  value,
  onChange,
  resultCount,
}: FAQSearchProps) {
  return (
    <section aria-labelledby="faq-search-heading">
      <div className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700">
        <div className="mb-4">
          <h2
            id="faq-search-heading"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Search frequently asked questions
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Search by keyword, category, workflow, or support topic.
          </p>
        </div>
        <SearchBar
          value={value}
          onChange={onChange}
          placeholder="Search FAQs..."
          label="Search frequently asked questions"
        />
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {resultCount} {resultCount === 1 ? "answer" : "answers"} found
        </p>
      </div>
    </section>
  );
}

export type { FAQSearchProps };
