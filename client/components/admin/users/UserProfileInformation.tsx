import { Building2 } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import ProfileSocialLinksCard from "@/components/job-seeker/profile/ProfileSocialLinksCard";
import type { AdminUser } from "@/types/admin-user.types";
import type { JobSeekerProfile } from "@/types/job-seeker-profile.types";

type UserProfileInformationProps = {
  user: AdminUser;
};

function getCompanyName(company: AdminUser["company"]) {
  if (!company) return undefined;
  return company.companyName || company.name;
}

export default function UserProfileInformation({ user }: UserProfileInformationProps) {
  const skills = [
    ...(user.skills ?? []),
    ...(user.technicalSkills ?? []),
    ...(user.softSkills ?? []),
  ];
  const dedupedSkills = Array.from(new Set(skills.filter(Boolean)));
  const companyName = getCompanyName(user.company);
  const socialProfile: JobSeekerProfile = {
    _id: user._id,
    fullName: user.name,
    email: user.email,
    linkedinUrl: user.linkedinUrl,
    githubUrl: user.githubUrl,
    portfolioUrl: user.portfolioUrl,
    otherLinks: user.otherLinks,
  };

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
      <div className="space-y-4">
        <Card
          header={
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-muted">
                Public profile fields returned by the user API.
              </p>
            </div>
          }
        >
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Professional Headline
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {user.headline || "No professional headline available."}
              </p>
            </div>
            {user.role === "employer" || companyName ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary">
                    <Building2 className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted">
                      Company
                    </p>
                    <p className="mt-1 font-semibold text-foreground">
                      {companyName || "Company information not available"}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {[user.company?.industry, user.company?.location]
                        .filter(Boolean)
                        .join(" - ") || "No company metadata available."}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Skills</p>
              {dedupedSkills.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {dedupedSkills.map((skill) => (
                    <Badge key={skill} variant="primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-2 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-muted">
                  No skills available.
                </p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-muted">
                  Experience Summary
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {user.experienceSummary || "No experience summary available."}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-muted">
                  Education Summary
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {user.educationSummary || "No education summary available."}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ProfileSocialLinksCard profile={socialProfile} />
    </section>
  );
}
