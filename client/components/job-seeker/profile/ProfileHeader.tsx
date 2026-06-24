"use client";

import Link from "next/link";
import {
  CalendarDays,
  Edit,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Share2,
} from "lucide-react";

import { Badge, Button } from "@/components/ui";
import type { JobSeekerProfile } from "@/types/job-seeker-profile.types";

type ProfileHeaderProps = {
  profile: JobSeekerProfile;
  onShare: () => void;
};

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfileHeader({ profile, onShare }: ProfileHeaderProps) {
  const completion = profile.profileCompletion ?? 0;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-surface shadow-sm">
      <div className="h-36 bg-[linear-gradient(135deg,#2563eb_0%,#0f766e_52%,#475569_100%)] sm:h-44">
        {profile.coverImage ? (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${profile.coverImage})` }}
          />
        ) : null}
      </div>

      <div className="px-5 pb-5 sm:px-6">
        <div className="-mt-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex size-28 items-center justify-center overflow-hidden rounded-lg border-4 border-surface bg-slate-100 text-3xl font-bold text-primary shadow-sm">
              {profile.avatar ? (
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${profile.avatar})` }}
                  aria-label={`${profile.fullName} avatar`}
                />
              ) : (
                <span>{getInitials(profile.fullName)}</span>
              )}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {profile.fullName}
                </h1>
                <Badge variant={completion >= 80 ? "success" : "warning"}>
                  {completion}% complete
                </Badge>
              </div>
              <p className="mt-1 max-w-2xl text-sm font-medium text-muted">
                {profile.headline ?? "Add a professional headline"}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-4" aria-hidden="true" />
                  {profile.email}
                </span>
                {profile.phone ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-4" aria-hidden="true" />
                    {profile.phone}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" aria-hidden="true" />
                  {profile.location ?? "Location not added"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Joined {formatDate(profile.joinedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/job-seeker/profile/edit">
              <Button leftIcon={<Edit className="size-4" aria-hidden="true" />}>
                Edit Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={onShare}
              leftIcon={<Share2 className="size-4" aria-hidden="true" />}
            >
              Share Profile
            </Button>
            <Button
              variant="ghost"
              className="size-11 px-0"
              aria-label="More profile actions"
              leftIcon={<MoreHorizontal className="size-5" aria-hidden="true" />}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Current designation
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {profile.currentDesignation ?? "Not added"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Preferred role
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {profile.preferredRole ?? "Not added"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Experience
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {profile.yearsOfExperience !== undefined
                ? `${profile.yearsOfExperience}+ years`
                : "Not added"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
