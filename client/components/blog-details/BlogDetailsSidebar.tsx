import Link from "next/link";
import { ArrowRight, FileUp, Mail } from "lucide-react";

import BlogTableOfContents from "@/components/blog-details/BlogTableOfContents";
import type { BlogTableOfContentsItem } from "@/lib/blog-data";

type BlogDetailsSidebarProps = {
  tableOfContents: BlogTableOfContentsItem[];
};

export default function BlogDetailsSidebar({
  tableOfContents,
}: BlogDetailsSidebarProps) {
  return (
    <aside className="grid gap-5 lg:sticky lg:top-24" aria-label="Article sidebar">
      <BlogTableOfContents items={tableOfContents} />

      <section className="rounded-lg bg-primary p-5 text-white shadow-sm">
        <span className="flex size-11 items-center justify-center rounded-md bg-white/15">
          <FileUp className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Upload your resume</h2>
        <p className="mt-2 text-sm leading-6 text-blue-50">
          Get ready for your next application with a clearer profile and better
          job matches.
        </p>
        <Link
          href="/jobs"
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-primary transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/70"
        >
          Start matching
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <section className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700">
        <span className="flex size-11 items-center justify-center rounded-md bg-emerald-50 text-accent dark:bg-emerald-950">
          <Mail className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Career notes weekly</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Practical job search, resume, and interview advice in one short email.
        </p>
        <form className="mt-4 grid gap-3">
          <label>
            <span className="sr-only">Email address</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <button
            type="submit"
            className="h-11 rounded-md bg-accent px-4 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            Subscribe
          </button>
        </form>
      </section>
    </aside>
  );
}

export type { BlogDetailsSidebarProps };
