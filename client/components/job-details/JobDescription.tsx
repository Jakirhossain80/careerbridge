import { CheckCircle2 } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { JobDetails } from "@/lib/job-details-data";

type JobDescriptionProps = {
  job: JobDetails;
};

export default function JobDescription({ job }: JobDescriptionProps) {
  return (
    <div className="grid gap-6">
      <Card contentClassName="p-6">
        <section aria-labelledby="job-description-heading">
          <h2
            id="job-description-heading"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Job description
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            {job.overview}
          </p>
        </section>
      </Card>

      <Card contentClassName="p-6">
        <section aria-labelledby="responsibilities-heading">
          <h2
            id="responsibilities-heading"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Responsibilities
          </h2>
          <ul className="mt-5 grid gap-4">
            {job.responsibilities.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </Card>

      <Card contentClassName="p-6">
        <section aria-labelledby="skills-heading">
          <h2
            id="skills-heading"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Required skills
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="neutral" className="px-3 py-1.5">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      </Card>

      <Card contentClassName="p-6">
        <section aria-labelledby="experience-heading">
          <h2
            id="experience-heading"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Required experience
          </h2>
          <ul className="mt-5 grid gap-4">
            {job.requiredExperience.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </Card>
    </div>
  );
}
