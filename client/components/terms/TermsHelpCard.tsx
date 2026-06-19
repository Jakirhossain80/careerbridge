import { Mail, MessageCircle } from "lucide-react";

import { termsContact } from "@/lib/terms-data";

export default function TermsHelpCard() {
  return (
    <aside
      aria-labelledby="terms-help-heading"
      className="rounded-lg border border-blue-100 bg-blue-50 p-5 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30"
    >
      <div className="flex size-11 items-center justify-center rounded-lg bg-white text-primary shadow-sm dark:bg-slate-900">
        <MessageCircle className="size-5" aria-hidden="true" />
      </div>
      <h2
        id="terms-help-heading"
        className="mt-4 text-lg font-bold tracking-tight text-foreground"
      >
        {termsContact.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        {termsContact.description}
      </p>
      <a
        href={termsContact.href}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <Mail className="size-4" aria-hidden="true" />
        {termsContact.email}
      </a>
      <p className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
        {termsContact.responseTime}
      </p>
    </aside>
  );
}
