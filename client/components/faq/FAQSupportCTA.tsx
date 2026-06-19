import Link from "next/link";
import { ArrowRight, LifeBuoy, Mail, MessageCircle } from "lucide-react";

import SectionHeader from "@/components/home/SectionHeader";

const supportOptions = [
  {
    title: "Contact support",
    description:
      "Send account, application, employer, recruiter, billing, or technical questions to the CareerBridge team.",
    href: "/contact",
    label: "Open contact page",
    icon: LifeBuoy,
  },
  {
    title: "Email the team",
    description:
      "Use email when you need to include screenshots, account details, or longer context for a support issue.",
    href: "mailto:support@careerbridge.com",
    label: "support@careerbridge.com",
    icon: Mail,
  },
  {
    title: "Share feedback",
    description:
      "Tell us which help topics should be added next as CareerBridge expands its hiring workflows.",
    href: "/contact#contact-form",
    label: "Send feedback",
    icon: MessageCircle,
  },
];

export default function FAQSupportCTA() {
  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Contact support"
          title="Still need help?"
          description="Reach the right support path when an FAQ answer does not cover your question."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {supportOptions.map((option) => {
            const Icon = option.icon;

            return (
              <article
                key={option.title}
                className="rounded-lg border border-slate-200 bg-background p-6 shadow-sm dark:border-slate-700"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {option.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {option.description}
                </p>
                <Link
                  href={option.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {option.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
