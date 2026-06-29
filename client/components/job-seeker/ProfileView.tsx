"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Edit, FileText, MapPin } from "lucide-react";

import { ProfileSkeleton } from "@/components/skeletons";
import { Badge, Button, Card } from "@/components/ui";
import { getJobSeekerProfile } from "@/services/job-seeker.service";

export default function ProfileView() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["job-seeker-profile"],
    queryFn: getJobSeekerProfile,
  });

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return <Card>Unable to load your profile.</Card>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card
        header={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">{profile.fullName}</h2>
              <p className="mt-1 text-sm text-slate-600">{profile.headline ?? profile.email}</p>
            </div>
            <Link href="/profile/edit">
              <Button leftIcon={<Edit className="size-4" />}>Edit profile</Button>
            </Link>
          </div>
        }
      >
        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">About</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {profile.about || "Add a short career summary to help employers understand your strengths."}
            </p>
          </section>
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.length ? (
                profile.skills.map((skill) => <Badge key={skill} variant="primary">{skill}</Badge>)
              ) : (
                <p className="text-sm text-slate-600">No skills added yet.</p>
              )}
            </div>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Experience</h3>
              <div className="mt-3 space-y-3">
                {profile.experience.length ? profile.experience.map((item) => (
                  <div key={`${item.company}-${item.title}`} className="rounded-md border border-slate-200 p-3">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.company}</p>
                  </div>
                )) : <p className="text-sm text-slate-600">No experience added.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Education</h3>
              <div className="mt-3 space-y-3">
                {profile.education.length ? profile.education.map((item) => (
                  <div key={`${item.institution}-${item.degree}`} className="rounded-md border border-slate-200 p-3">
                    <p className="font-semibold">{item.degree}</p>
                    <p className="text-sm text-slate-600">{item.institution}</p>
                  </div>
                )) : <p className="text-sm text-slate-600">No education added.</p>}
              </div>
            </div>
          </section>
        </div>
      </Card>
      <aside className="space-y-4">
        <Card>
          <div className="space-y-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Contact</p>
            <p>{profile.email}</p>
            {profile.phone ? <p>{profile.phone}</p> : null}
            {profile.location ? <p className="flex items-center gap-2"><MapPin className="size-4" />{profile.location}</p> : null}
          </div>
        </Card>
        <Card>
          <p className="font-semibold">Preferences</p>
          <p className="mt-2 text-sm text-slate-600">
            {[...profile.preferredJobTypes, ...profile.preferredWorkModes].join(", ") || "No preferences set."}
          </p>
          <Link href="/profile/resumes" className="mt-4 inline-flex text-sm font-semibold text-primary">
            <FileText className="mr-2 size-4" /> Manage resumes
          </Link>
        </Card>
      </aside>
    </div>
  );
}
