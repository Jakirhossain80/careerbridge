"use client";

import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type { ApplicantDetails } from "@/types/application.types";

type ApplicantProfilePanelProps = {
  application: ApplicantDetails;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfileLink({ href, label }: { href?: string; label: string }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-blue-700"
    >
      {label}
      <ExternalLink className="size-3.5" aria-hidden="true" />
    </a>
  );
}

export default function ApplicantProfilePanel({
  application,
}: ApplicantProfilePanelProps) {
  return (
    <Card className="h-fit" contentClassName="space-y-6 p-5">
      <div className="text-center">
        <div className="mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xl font-bold text-primary">
          {application.applicantAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={application.applicantAvatar}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            getInitials(application.applicantName)
          )}
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">
          {application.applicantName}
        </h2>
        <p className="mt-1 text-sm font-medium text-muted">
          {application.jobTitle}
        </p>
        {application.location ? (
          <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-sm text-muted">
            <MapPin className="size-4" aria-hidden="true" />
            {application.location}
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-background p-4 text-center dark:border-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Fit score
        </p>
        <p className="mt-1 text-3xl font-bold text-primary">
          {application.matchScore ?? 0}%
        </p>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-foreground">Top skills</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {(application.skills ?? []).length > 0 ? (
            application.skills?.map((skill) => (
              <Badge key={skill} variant="primary">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted">No skills listed.</p>
          )}
        </div>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="text-sm font-semibold text-foreground">Profile</h3>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Experience
          </p>
          <p className="mt-1 text-foreground">
            {application.experienceYears
              ? `${application.experienceYears}+ years`
              : "Not provided"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Education
          </p>
          <p className="mt-1 text-foreground">
            {application.education ?? "Not provided"}
          </p>
        </div>
      </section>

      <section className="space-y-3 text-sm">
        <h3 className="text-sm font-semibold text-foreground">Contact</h3>
        <p className="flex items-start gap-2 text-muted">
          <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span className="break-all">{application.applicantEmail}</span>
        </p>
        {application.applicantPhone ? (
          <p className="flex items-center gap-2 text-muted">
            <Phone className="size-4" aria-hidden="true" />
            {application.applicantPhone}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
          <ProfileLink href={application.portfolioUrl} label="Portfolio" />
          <ProfileLink href={application.linkedinUrl} label="LinkedIn" />
          <ProfileLink href={application.githubUrl} label="GitHub" />
        </div>
      </section>
    </Card>
  );
}
