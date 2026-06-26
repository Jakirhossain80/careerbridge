"use client";

import { AlertTriangle, CheckCircle2, Clock3, HelpCircle, XCircle } from "lucide-react";

import Badge from "@/components/ui/Badge";
import type {
  EmployerChecklistStatus,
  EmployerVerificationChecklistItem,
  PendingEmployer,
} from "@/types/admin-employer-verification";

type EmployerVerificationChecklistProps = {
  employer: PendingEmployer;
};

const statusConfig: Record<
  EmployerChecklistStatus,
  {
    icon: typeof CheckCircle2;
    badge: "success" | "warning" | "danger" | "neutral" | "primary";
    label: string;
  }
> = {
  verified: { icon: CheckCircle2, badge: "success", label: "Verified" },
  warning: { icon: AlertTriangle, badge: "warning", label: "Warning" },
  failed: { icon: XCircle, badge: "danger", label: "Failed" },
  pending: { icon: Clock3, badge: "warning", label: "Pending" },
  missing: { icon: HelpCircle, badge: "neutral", label: "Missing" },
};

function buildFallbackChecklist(employer: PendingEmployer) {
  const ownerEmail =
    employer.email ??
    employer.ownerEmail ??
    (typeof employer.ownerId === "object" ? employer.ownerId?.email : undefined);
  const websiteDomain = employer.website
    ? employer.website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]
    : "";
  const emailDomain = ownerEmail?.split("@")[1] ?? "";
  const domainMatches =
    Boolean(websiteDomain && emailDomain) &&
    (websiteDomain === emailDomain || websiteDomain.endsWith(`.${emailDomain}`));

  return [
    {
      key: "business-document",
      label: "Business document / Tax ID",
      status: "pending",
      message: "Awaiting backend document verification signal.",
    },
    {
      key: "domain-email",
      label: "Domain email match",
      status: domainMatches ? "verified" : websiteDomain && emailDomain ? "warning" : "missing",
      message: domainMatches
        ? "Employer email matches company domain."
        : "Review email and website domain manually.",
    },
    {
      key: "license-document",
      label: "License / document verification",
      status: "pending",
      message: "Prepared for document review integration.",
    },
    {
      key: "company-profile",
      label: "Company profile completeness",
      status:
        employer.name && employer.industry && employer.website && (employer.location || employer.headquarters)
          ? "verified"
          : "warning",
      message: "Name, industry, website, and location are checked.",
    },
    {
      key: "manual-warnings",
      label: "Manual review warnings",
      status: "pending",
      message: "No automated warning feed is connected yet.",
    },
  ] satisfies EmployerVerificationChecklistItem[];
}

export default function EmployerVerificationChecklist({
  employer,
}: EmployerVerificationChecklistProps) {
  const checklist = employer.verificationChecklist?.length
    ? employer.verificationChecklist
    : buildFallbackChecklist(employer);

  return (
    <div className="min-w-72 space-y-2">
      {checklist.slice(0, 5).map((item) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;

        return (
          <div key={item.key} className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2">
              <Icon className="mt-0.5 size-4 shrink-0 text-slate-500" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {item.label}
                </p>
                {item.message ? (
                  <p className="max-w-72 truncate text-xs text-muted">{item.message}</p>
                ) : null}
              </div>
            </div>
            <Badge variant={config.badge} className="shrink-0 capitalize">
              {config.label}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
