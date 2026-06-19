import { BadgeCheck, HelpCircle, Search } from "lucide-react";

import { faqCategories, faqItems } from "@/lib/faq-data";

export default function FAQHero() {
  const featuredCount = faqItems.filter((item) => item.featured).length;

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute inset-x-0 top-0 h-56 bg-blue-50 dark:bg-blue-950/30" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm dark:border-blue-900 dark:bg-slate-900">
            <HelpCircle className="size-4" aria-hidden="true" />
            CareerBridge FAQ
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Answers for every step of your hiring journey.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Find quick guidance for job seekers, employers, recruiters,
            account settings, applications, and general platform questions.
          </p>
          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            {[
              "Searchable help topics",
              "Category-based answers",
              "Support when you need more help",
            ].map((highlight) => (
              <li key={highlight} className="inline-flex items-center gap-2">
                <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-blue-900/10 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-primary">
                Help center snapshot
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                Browse common questions before contacting support.
              </h2>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950">
              <Search className="size-6" aria-hidden="true" />
            </div>
          </div>
          <dl className="grid gap-4 py-5 sm:grid-cols-3">
            {[
              { label: "FAQ topics", value: faqItems.length },
              { label: "Categories", value: faqCategories.length },
              { label: "Featured", value: featuredCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800"
              >
                <dt className="text-sm leading-6 text-muted">{stat.label}</dt>
                <dd className="mt-2 text-2xl font-bold text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/40">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Content is structured for future CMS or backend API replacement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
