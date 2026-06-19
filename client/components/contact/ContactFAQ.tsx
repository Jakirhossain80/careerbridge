import { contactFAQItems } from "@/lib/contact-data";

import SectionHeader from "@/components/home/SectionHeader";

export default function ContactFAQ() {
  return (
    <section id="faq" className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="FAQ preview"
          title="Common contact questions"
          description="A few quick answers before you reach the team."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {contactFAQItems.map((item) => (
            <article
              key={item.question}
              className="rounded-lg border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
