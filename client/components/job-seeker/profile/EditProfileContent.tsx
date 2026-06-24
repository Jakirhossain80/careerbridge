"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { Button, Card, LoadingSkeleton } from "@/components/ui";
import EditProfileForm from "@/components/job-seeker/profile/EditProfileForm";
import { jobSeekerProfileQueryKeys } from "@/components/job-seeker/profile/MyProfileContent";
import { getJobSeekerProfile } from "@/services/job-seeker-profile.service";

function EditProfileLoadingState() {
  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <p className="text-sm font-medium text-muted">Loading profile editor...</p>
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-6">
            <LoadingSkeleton variant="card" rows={4} />
            <LoadingSkeleton variant="card" rows={4} />
          </div>
          <div className="space-y-6">
            <LoadingSkeleton variant="card" rows={5} />
            <LoadingSkeleton variant="card" rows={5} />
            <LoadingSkeleton variant="card" rows={5} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function EditProfileContent() {
  const profileQuery = useQuery({
    queryKey: jobSeekerProfileQueryKeys.profile,
    queryFn: getJobSeekerProfile,
  });

  if (profileQuery.isLoading) {
    return <EditProfileLoadingState />;
  }

  if (profileQuery.isError) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Card className="border-red-200 bg-red-50">
            <h1 className="text-base font-semibold text-red-900">
              Unable to load profile information. Please try again.
            </h1>
            <p className="mt-2 text-sm text-red-700">
              Your changes cannot be saved until the latest profile data loads.
            </p>
            <Button className="mt-4" onClick={() => void profileQuery.refetch()}>
              Retry
            </Button>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 pb-28 sm:px-6 lg:pb-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">My Profile</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Edit professional profile
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              Keep your personal details, skills, experience, education, and links ready
              for employers.
            </p>
          </div>
          <Link href="/job-seeker/profile">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
            >
              Back to Profile
            </Button>
          </Link>
        </section>

        <EditProfileForm profile={profileQuery.data} />
      </div>
    </main>
  );
}
