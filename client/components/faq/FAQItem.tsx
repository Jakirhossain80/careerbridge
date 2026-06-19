"use client";

import { ChevronDown } from "lucide-react";

import type { FAQItem as FAQItemType } from "@/lib/faq-data";

type FAQItemProps = {
  item: FAQItemType;
  isOpen: boolean;
  onToggle: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function FAQItem({ item, isOpen, onToggle }: FAQItemProps) {
  const buttonId = `${item.id}-button`;
  const panelId = `${item.id}-panel`;

  return (
    <article className="rounded-lg border border-slate-200 bg-surface shadow-sm dark:border-slate-700">
      <h3>
        <button
          id={buttonId}
          type="button"
          className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-primary">
              {item.category}
            </span>
            <span className="mt-2 block text-base font-semibold leading-7 text-foreground sm:text-lg">
              {item.question}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "mt-1 size-5 shrink-0 text-muted transition-transform duration-200",
              isOpen && "rotate-180 text-primary",
            )}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-muted dark:border-slate-800">
            {item.answer}
          </p>
        </div>
      </div>
    </article>
  );
}

export type { FAQItemProps };
