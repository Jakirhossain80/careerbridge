import Link from "next/link";
import { CheckCircle2, Upload, UserRound } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { JobSeekerDashboardData } from "@/types/job-seeker-dashboard.types";

type ProfileStrengthCardProps = {
  profile: JobSeekerDashboardData["profile"];
};

export default function ProfileStrengthCard({ profile }: ProfileStrengthCardProps) {
  const completion = Math.max(0, Math.min(profile.profileCompletion, 100));

  return (
    <Card contentClassName="p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50 text-primary">
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <UserRound className="size-7" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted">Welcome back</p>
            <h2 className="mt-1 truncate text-xl font-semibold text-foreground">
              {profile.fullName}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted">
              {profile.headline ?? profile.email}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={profile.resumeUploaded ? "success" : "warning"}>
                {profile.resumeUploaded ? "Resume uploaded" : "Resume missing"}
              </Badge>
              <Badge variant="primary">{completion}% complete</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/job-seeker/profile/edit"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Complete Profile
          </Link>
          <Link
            href="/profile/resumes"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            <Upload className="size-4" aria-hidden="true" />
            Upload Resume
          </Link>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Profile strength</span>
          <span className="text-muted">{completion}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
