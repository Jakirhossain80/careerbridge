import { Mail } from "lucide-react";

import Button from "@/components/ui/Button";

export default function BlogNewsletterCTA() {
  return (
    <section
      aria-labelledby="blog-newsletter-heading"
      className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
    >
      <span className="flex size-11 items-center justify-center rounded-md bg-emerald-50 text-accent dark:bg-emerald-950">
        <Mail className="size-5" aria-hidden="true" />
      </span>
      <h2 id="blog-newsletter-heading" className="mt-4 text-lg font-semibold">
        Weekly career insights
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Get practical job search advice, interview prep, and hiring trend notes
        delivered to your inbox.
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
        <Button type="submit" className="w-full">
          Subscribe
        </Button>
      </form>
    </section>
  );
}
