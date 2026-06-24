import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";

type ProfileSkillsCardProps = {
  technicalSkills?: string[];
  softSkills?: string[];
};

function SkillGroup({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {skills.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="primary">
              {skill}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted">No {title.toLowerCase()} added yet.</p>
      )}
    </div>
  );
}

export default function ProfileSkillsCard({
  technicalSkills = [],
  softSkills = [],
}: ProfileSkillsCardProps) {
  const hasSkills = technicalSkills.length > 0 || softSkills.length > 0;

  return (
    <Card
      header={
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Skills</h2>
            <p className="mt-1 text-sm text-muted">Technical and workplace strengths.</p>
          </div>
          <Link href="/job-seeker/profile/edit">
            <Button
              size="sm"
              variant="ghost"
              className="size-9 px-0"
              aria-label="Update skills"
              leftIcon={<Plus className="size-4" aria-hidden="true" />}
            />
          </Link>
        </div>
      }
    >
      {hasSkills ? (
        <div className="space-y-5">
          <SkillGroup title="Technical Skills" skills={technicalSkills} />
          <SkillGroup title="Soft Skills" skills={softSkills} />
          <Link href="/job-seeker/profile/edit" className="inline-flex text-sm font-semibold text-primary">
            Update Skills
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-muted">
          <p>No skills added yet.</p>
          <Link href="/job-seeker/profile/edit" className="mt-3 inline-flex">
            <Button size="sm">Update Skills</Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
