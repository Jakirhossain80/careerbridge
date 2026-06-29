import { ExternalLink, GitBranch, Globe, Network } from "lucide-react";

import { ProfileSectionEmptyState } from "@/components/empty-states";
import { Card } from "@/components/ui";
import type { JobSeekerProfile } from "@/types/job-seeker-profile.types";

type ProfileSocialLinksCardProps = {
  profile: JobSeekerProfile;
};

export default function ProfileSocialLinksCard({
  profile,
}: ProfileSocialLinksCardProps) {
  const links = [
    { label: "LinkedIn", url: profile.linkedinUrl, icon: Network },
    { label: "GitHub", url: profile.githubUrl, icon: GitBranch },
    { label: "Portfolio", url: profile.portfolioUrl, icon: Globe },
    ...(profile.otherLinks ?? []).map((link) => ({
      label: link.label,
      url: link.url,
      icon: ExternalLink,
    })),
  ].filter((link) => Boolean(link.url));

  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">Connect</h2>
          <p className="mt-1 text-sm text-muted">Professional profiles and links.</p>
        </div>
      }
    >
      {links.length ? (
        <div className="space-y-3">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={`${link.label}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="size-4" aria-hidden="true" />
                  {link.label}
                </span>
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      ) : (
        <ProfileSectionEmptyState title="No social links added yet." />
      )}
    </Card>
  );
}
