import type { PrivacySection as PrivacySectionType } from "@/lib/privacy-data";

type PrivacySectionProps = {
  section: PrivacySectionType;
  index: number;
};

export default function PrivacySection({ section, index }: PrivacySectionProps) {
  const sectionNumber = String(index + 1).padStart(2, "0");

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="scroll-mt-28 border-b border-slate-200 px-5 py-8 last:border-b-0 sm:px-8 dark:border-slate-700"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-primary dark:bg-blue-950/50"
          aria-hidden="true"
        >
          {sectionNumber}
        </span>
        <div className="max-w-3xl">
          <h2
            id={`${section.id}-heading`}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            {section.title}
          </h2>
          {section.lead ? (
            <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-200">
              {section.lead}
            </p>
          ) : null}
          {section.paragraphs?.length ? (
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          {section.items?.length ? (
            <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    className="mt-2 size-2 shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
