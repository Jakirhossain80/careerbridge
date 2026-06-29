import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";

import { ProfileSectionEmptyState } from "@/components/empty-states";
import { Button, Card } from "@/components/ui";
import type { JobSeekerProfileExperience } from "@/types/job-seeker-profile.types";

type ProfileExperienceSectionProps = {
  experience?: JobSeekerProfileExperience[];
};

function formatDate(value?: string) {
  if (!value) {
    return "Present";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProfileExperienceSection({
  experience = [],
}: ProfileExperienceSectionProps) {
  return (
    <Card
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Professional Experience
            </h2>
            <p className="mt-1 text-sm text-muted">
              Roles, companies, and responsibilities.
            </p>
          </div>
          <Link href="/job-seeker/profile/edit">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Plus className="size-4" aria-hidden="true" />}
            >
              Add Experience
            </Button>
          </Link>
        </div>
      }
    >
      {experience.length ? (
        <div className="space-y-5">
          {experience.map((item, index) => (
            <article
              key={item._id}
              className="relative border-l border-slate-200 pl-5"
            >
              <span className="absolute -left-1.5 top-1 size-3 rounded-full bg-primary" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {item.company}
                    {item.employmentType ? ` - ${item.employmentType}` : ""}
                  </p>
                </div>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {formatDate(item.startDate)} -{" "}
                  {item.currentlyWorking ? "Present" : formatDate(item.endDate)}
                </p>
              </div>
              {item.description ? (
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {item.description}
                </p>
              ) : null}
              {index < experience.length - 1 ? <div className="mt-5" /> : null}
            </article>
          ))}
        </div>
      ) : (
        <ProfileSectionEmptyState
          title="No experience added yet."
          actionLabel="Add Experience"
          actionHref="/job-seeker/profile/edit"
        />
      )}
    </Card>
  );
}
