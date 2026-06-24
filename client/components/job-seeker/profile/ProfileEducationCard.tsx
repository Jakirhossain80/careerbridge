import Link from "next/link";
import { GraduationCap, Plus } from "lucide-react";

import { Button, Card } from "@/components/ui";
import type { JobSeekerProfileEducation } from "@/types/job-seeker-profile.types";

type ProfileEducationCardProps = {
  education?: JobSeekerProfileEducation[];
};

export default function ProfileEducationCard({
  education = [],
}: ProfileEducationCardProps) {
  return (
    <Card
      header={
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Education</h2>
            <p className="mt-1 text-sm text-muted">Degrees and institutions.</p>
          </div>
          <Link href="/job-seeker/profile/edit">
            <Button
              size="sm"
              variant="ghost"
              className="size-9 px-0"
              aria-label="Add education"
              leftIcon={<Plus className="size-4" aria-hidden="true" />}
            />
          </Link>
        </div>
      }
    >
      {education.length ? (
        <div className="space-y-4">
          {education.map((item) => (
            <article key={item._id} className="flex gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{item.degree}</h3>
                <p className="mt-1 text-sm text-muted">{item.institution}</p>
                <p className="mt-1 text-sm text-muted">
                  {[item.fieldOfStudy, item.graduationYear]
                    .filter(Boolean)
                    .join(" - ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-muted">
          <p>No education added yet.</p>
          <Link href="/job-seeker/profile/edit" className="mt-3 inline-flex">
            <Button size="sm">Add Education</Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
