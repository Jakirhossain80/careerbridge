import { aboutTeam } from "@/lib/about-data";

import SectionHeader from "@/components/home/SectionHeader";

export default function AboutTeam() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          eyebrow="Team"
          title="People shaping a more practical hiring experience"
          description="CareerBridge is built by a team focused on product clarity, talent operations, and candidate experience."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {aboutTeam.map((member) => (
            <article
              key={member.name}
              className="rounded-lg border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-700"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-blue-50 text-base font-bold text-primary dark:bg-blue-950">
                {member.initials}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-primary">
                {member.role}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
