import Link from "next/link";
import { HelpCircle, Mail, MessageCircle, Share2 } from "lucide-react";

import { communityLinks, contactSupportCards } from "@/lib/contact-data";

import SectionHeader from "@/components/home/SectionHeader";

const toneClasses = {
  blue: "bg-blue-50 text-primary dark:bg-blue-950",
  emerald: "bg-emerald-50 text-accent dark:bg-emerald-950",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
};

function getCardIcon(title: string) {
  if (title === "Email support") {
    return Mail;
  }

  if (title === "Help Center") {
    return HelpCircle;
  }

  if (title === "Community links") {
    return Share2;
  }

  return MessageCircle;
}

export default function ContactInfoCards() {
  return (
    <section className="bg-surface px-6 py-16" id="community">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          align="center"
          eyebrow="Support channels"
          title="Choose the best way to reach us"
          description="Use the route that matches your request so CareerBridge can respond with the right context."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactSupportCards.map((card) => {
            const Icon = getCardIcon(card.title);

            return (
              <article
                key={card.title}
                className="rounded-lg border border-slate-200 bg-background p-6 shadow-sm dark:border-slate-700"
              >
                <div
                  className={`flex size-11 items-center justify-center rounded-full ${toneClasses[card.tone]}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {card.description}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
                  {card.meta}
                </p>
                <Link
                  href={card.href}
                  className="mt-5 inline-flex text-sm font-semibold text-primary transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {card.actionLabel}
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-background p-5 dark:border-slate-700">
          <h3 className="text-base font-semibold text-foreground">
            Community and social links
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {communityLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-surface px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
