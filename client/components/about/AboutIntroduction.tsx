import { careerBridgeIntro } from "@/lib/about-data";

import SectionHeader from "@/components/home/SectionHeader";

export default function AboutIntroduction() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeader
          eyebrow={careerBridgeIntro.eyebrow}
          title={careerBridgeIntro.title}
        />
        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700 md:p-8">
          <p className="text-lg leading-8 text-muted">
            {careerBridgeIntro.description}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["Discover", "Match", "Hire"].map((item) => (
              <div
                key={item}
                className="rounded-lg bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-primary dark:bg-blue-950/50"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
