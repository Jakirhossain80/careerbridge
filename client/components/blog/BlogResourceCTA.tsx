import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export default function BlogResourceCTA() {
  return (
    <section className="rounded-lg bg-primary p-5 text-white shadow-sm">
      <span className="flex size-11 items-center justify-center rounded-md bg-white/15">
        <Download className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">Free career guide</h2>
      <p className="mt-2 text-sm leading-6 text-blue-50">
        Download the CareerBridge job search checklist to organize applications,
        interviews, follow-ups, and offer decisions.
      </p>
      <Link
        href="/contact"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-primary transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/70"
      >
        Get the guide
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
