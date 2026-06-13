import { Mail } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700 md:grid-cols-[1fr_0.9fr] md:items-center md:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Newsletter
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            Get fresh jobs and career insights weekly.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Receive curated roles, hiring trends, and practical guidance for
            building a stronger career profile.
          </p>
        </div>

        <form className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
          <label
            htmlFor="newsletter-email"
            className="block text-sm font-semibold text-foreground"
          >
            Email address
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-md border border-slate-200 bg-white px-4 pl-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-5 text-sm font-semibold text-white shadow-sm shadow-emerald-900/10 transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">
            No spam. Unsubscribe whenever your search changes.
          </p>
        </form>
      </div>
    </section>
  );
}
