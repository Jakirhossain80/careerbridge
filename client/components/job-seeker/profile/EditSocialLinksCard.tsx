"use client";

import { GitBranch, Globe, Network } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Card, Input } from "@/components/ui";
import type { JobSeekerProfileFormValues } from "@/lib/validations/job-seeker-profile.schema";

type EditSocialLinksCardProps = {
  errors: FieldErrors<JobSeekerProfileFormValues>;
  register: UseFormRegister<JobSeekerProfileFormValues>;
};

export default function EditSocialLinksCard({
  errors,
  register,
}: EditSocialLinksCardProps) {
  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">Social links</h2>
          <p className="mt-1 text-sm text-muted">Professional profiles employers can verify.</p>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label={
            <span className="inline-flex items-center gap-2">
              <Network className="size-4" aria-hidden="true" />
              LinkedIn
            </span>
          }
          placeholder="https://www.linkedin.com/in/username"
          error={errors.linkedinUrl?.message}
          {...register("linkedinUrl")}
        />
        <Input
          label={
            <span className="inline-flex items-center gap-2">
              <GitBranch className="size-4" aria-hidden="true" />
              GitHub
            </span>
          }
          placeholder="https://github.com/username"
          error={errors.githubUrl?.message}
          {...register("githubUrl")}
        />
        <Input
          label={
            <span className="inline-flex items-center gap-2">
              <Globe className="size-4" aria-hidden="true" />
              Portfolio
            </span>
          }
          placeholder="https://yourportfolio.dev"
          error={errors.portfolioUrl?.message}
          {...register("portfolioUrl")}
        />
      </div>
    </Card>
  );
}
