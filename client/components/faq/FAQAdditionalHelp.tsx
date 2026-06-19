import { BookOpen, BriefcaseBusiness, Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import SectionHeader from "@/components/home/SectionHeader";

const helpLinks = [
  {
    title: "Browse jobs",
    description: "Explore current roles by title, location, category, and work mode.",
    href: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "View companies",
    description: "Learn about hiring teams, company profiles, and open roles.",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Read about CareerBridge",
    description: "See how the platform connects talent and opportunity.",
    href: "/about",
    icon: BookOpen,
  },
  {
    title: "Account help",
    description: "Get support for sign in, verification, pending, or blocked accounts.",
    href: "/contact",
    icon: ShieldCheck,
  },
];

export default function FAQAdditionalHelp() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Additional help"
          title="Helpful places to continue"
          description="Use these pages when you want to move from an answer into the next action."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {helpLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-accent dark:bg-emerald-950/40">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {link.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {link.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
