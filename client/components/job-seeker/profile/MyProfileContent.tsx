"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Copy, ExternalLink } from "lucide-react";

import { Button, Card, LoadingSkeleton, Modal } from "@/components/ui";
import ProfileEducationCard from "@/components/job-seeker/profile/ProfileEducationCard";
import ProfileExperienceSection from "@/components/job-seeker/profile/ProfileExperienceSection";
import ProfileHeader from "@/components/job-seeker/profile/ProfileHeader";
import ProfileProjectsSection from "@/components/job-seeker/profile/ProfileProjectsSection";
import ProfileResumeCard from "@/components/job-seeker/profile/ProfileResumeCard";
import ProfileSkillsCard from "@/components/job-seeker/profile/ProfileSkillsCard";
import ProfileSocialLinksCard from "@/components/job-seeker/profile/ProfileSocialLinksCard";
import ProfileStatsCard from "@/components/job-seeker/profile/ProfileStatsCard";
import {
  getJobSeekerProfile,
  getJobSeekerProfileStats,
  getMyResumes,
} from "@/services/job-seeker-profile.service";

export const jobSeekerProfileQueryKeys = {
  profile: ["job-seeker-profile"] as const,
  stats: ["job-seeker-profile-stats"] as const,
  resumes: ["job-seeker-resumes"] as const,
};

function MyProfileLoadingState() {
  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <p className="text-sm font-medium text-muted">Loading profile...</p>
        <LoadingSkeleton variant="card" className="min-h-64" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function MyProfileContent() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedProfileLink, setCopiedProfileLink] = useState(false);

  const profileQuery = useQuery({
    queryKey: jobSeekerProfileQueryKeys.profile,
    queryFn: getJobSeekerProfile,
  });

  const statsQuery = useQuery({
    queryKey: jobSeekerProfileQueryKeys.stats,
    queryFn: getJobSeekerProfileStats,
  });

  const resumesQuery = useQuery({
    queryKey: jobSeekerProfileQueryKeys.resumes,
    queryFn: getMyResumes,
  });

  const profileUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "/job-seeker/profile";
    }

    return `${window.location.origin}/job-seeker/profile`;
  }, []);

  const selectedResume = useMemo(() => {
    const resumes = resumesQuery.data ?? [];
    return resumes.find((resume) => resume.isDefault) ?? resumes[0] ?? profileQuery.data?.resume;
  }, [profileQuery.data?.resume, resumesQuery.data]);

  async function handleCopyProfileLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(profileUrl);
      setCopiedProfileLink(true);
      window.setTimeout(() => setCopiedProfileLink(false), 1800);
    }
  }

  if (profileQuery.isLoading) {
    return <MyProfileLoadingState />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Card className="border-red-200 bg-red-50">
            <h1 className="text-base font-semibold text-red-900">
              Unable to load profile. Please try again.
            </h1>
            <Button className="mt-4" onClick={() => void profileQuery.refetch()}>
              Retry
            </Button>
          </Card>
        </div>
      </main>
    );
  }

  const profile = profileQuery.data;
  const stats = statsQuery.data ?? profile.stats;

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">My Profile</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Professional profile
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              Review the profile employers see across CareerBridge.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/profile/applications">
              <Button variant="outline">View Applied Jobs</Button>
            </Link>
            <Link href="/profile/saved-jobs">
              <Button variant="outline">View Saved Jobs</Button>
            </Link>
          </div>
        </section>

        <ProfileHeader
          profile={profile}
          onShare={() => setIsShareModalOpen(true)}
        />

        <ProfileStatsCard stats={stats} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card
              header={
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Professional Summary
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Career summary and role preferences.
                  </p>
                </div>
              }
            >
              <p className="text-sm leading-6 text-slate-700">
                {profile.about ??
                  "Add a short career summary to help employers understand your strengths."}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Years of experience
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    {profile.yearsOfExperience !== undefined
                      ? `${profile.yearsOfExperience}+ years`
                      : "Not added"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Current designation
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    {profile.currentDesignation ?? "Not added"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Preferred job role
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    {profile.preferredRole ?? "Not added"}
                  </p>
                </div>
              </div>
            </Card>

            <ProfileExperienceSection experience={profile.experience} />
            <ProfileProjectsSection projects={profile.projects} />
          </div>

          <aside className="space-y-6">
            <ProfileResumeCard resume={selectedResume} />
            <ProfileSkillsCard
              technicalSkills={profile.technicalSkills}
              softSkills={profile.softSkills}
            />
            <ProfileEducationCard education={profile.education} />
            <ProfileSocialLinksCard profile={profile} />
          </aside>
        </section>
      </div>

      <Modal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share profile"
        description="Copy your CareerBridge profile link."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => void handleCopyProfileLink()}
              leftIcon={<Copy className="size-4" aria-hidden="true" />}
            >
              {copiedProfileLink ? "Copied" : "Copy Link"}
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 truncate">{profileUrl}</span>
        </div>
      </Modal>
    </main>
  );
}
