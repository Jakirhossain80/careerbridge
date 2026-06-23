"use client";

import Link from "next/link";
import { Download, ExternalLink, Mail, MapPin, Phone, User } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { InterviewDetails } from "@/types/interview.types";

type CandidateSummaryCardProps = {
  interview: InterviewDetails;
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
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-blue-700"
    >
      {label}
      <ExternalLink className="size-3.5" aria-hidden="true" />
    </a>
  );
}

export default function CandidateSummaryCard({
  interview,
}: CandidateSummaryCardProps) {
  return (
    <Card className="h-fit" contentClassName="space-y-6 p-5">
      <div className="text-center">
        <div className="mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xl font-bold text-primary">
          {interview.candidateAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={interview.candidateAvatar}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            getInitials(interview.candidateName)
          )}
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">
          {interview.candidateName}
        </h2>
        <p className="mt-1 text-sm font-medium text-muted">
          {interview.jobTitle}
        </p>
        {interview.candidateLocation ? (
          <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-sm text-muted">
            <MapPin className="size-4" aria-hidden="true" />
            {interview.candidateLocation}
          </p>
        ) : null}
      </div>

      <section className="space-y-3 text-sm">
        <h3 className="text-sm font-semibold text-foreground">
          Candidate Information
        </h3>
        {interview.candidateEmail ? (
          <p className="flex items-start gap-2 text-muted">
            <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span className="break-all">{interview.candidateEmail}</span>
          </p>
        ) : null}
        {interview.candidatePhone ? (
          <p className="flex items-center gap-2 text-muted">
            <Phone className="size-4" aria-hidden="true" />
            {interview.candidatePhone}
          </p>
        ) : null}
        {!interview.candidateEmail && !interview.candidatePhone ? (
          <p className="flex items-center gap-2 text-muted">
            <User className="size-4" aria-hidden="true" />
            Contact information not provided.
          </p>
        ) : null}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground">Skills</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {(interview.candidateSkills ?? []).length > 0 ? (
            interview.candidateSkills?.map((skill) => (
              <Badge key={skill} variant="primary">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted">No skills listed.</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground">
          Experience Summary
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          {interview.candidateSummary ?? "No experience summary provided."}
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Links</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <ProfileLink href={interview.resumeUrl} label="View Resume" />
          <ProfileLink href={interview.portfolioUrl} label="Portfolio" />
          <ProfileLink href={interview.linkedinUrl} label="LinkedIn" />
          <ProfileLink href={interview.githubUrl} label="GitHub" />
        </div>
      </section>

      <div className="flex flex-col gap-2">
        <Link
          href={`/employer/applicants/${interview.applicationId}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View Applicant Details
        </Link>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Download className="size-4" aria-hidden="true" />}
          disabled={!interview.resumeUrl}
          onClick={() => {
            if (interview.resumeUrl) {
              window.open(interview.resumeUrl, "_blank", "noopener,noreferrer");
            }
          }}
        >
          Download Resume
        </Button>
      </div>
    </Card>
  );
}
