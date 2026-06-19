"use client";

import { useState } from "react";

import type { FAQItem as FAQItemType } from "@/lib/faq-data";

import FAQItem from "./FAQItem";

type FAQAccordionProps = {
  items: FAQItemType[];
};

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(
    items[0]?.id ?? null,
  );

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-surface p-8 text-center dark:border-slate-700">
        <h3 className="text-lg font-semibold text-foreground">
          No FAQ results found
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          Try a different search term or choose another category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <FAQItem
          key={item.id}
          item={item}
          isOpen={openItemId === item.id}
          onToggle={() =>
            setOpenItemId((currentId) =>
              currentId === item.id ? null : item.id,
            )
          }
        />
      ))}
    </div>
  );
}

export type { FAQAccordionProps };
