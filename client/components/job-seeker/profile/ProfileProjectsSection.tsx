import Link from "next/link";
import { ExternalLink, GitBranch, Plus } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { JobSeekerProfileProject } from "@/types/job-seeker-profile.types";

type ProfileProjectsSectionProps = {
  projects?: JobSeekerProfileProject[];
};

export default function ProfileProjectsSection({
  projects = [],
}: ProfileProjectsSectionProps) {
  return (
    <Card
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Featured Projects
            </h2>
            <p className="mt-1 text-sm text-muted">
              Work samples that show your strengths.
            </p>
          </div>
          <Link href="/job-seeker/profile/edit">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Plus className="size-4" aria-hidden="true" />}
            >
              Add Project
            </Button>
          </Link>
        </div>
      }
    >
      {projects.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project._id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <h3 className="font-semibold text-foreground">{project.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                {project.description ?? "No project description added."}
              </p>
              {project.technologies?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <Badge key={technology} variant="neutral">
                      {technology}
                    </Badge>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                {project.projectUrl ? (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    View project
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-700"
                  >
                    <GitBranch className="size-4" aria-hidden="true" />
                    GitHub
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-muted">
          <p>No projects added yet.</p>
          <Link href="/job-seeker/profile/edit" className="mt-3 inline-flex">
            <Button size="sm">Add Project</Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
