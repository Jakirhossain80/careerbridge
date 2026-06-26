"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Clock3,
  Download,
  Eye,
  FileText,
  History,
  MoreHorizontal,
  UserRound,
} from "lucide-react";

import Button from "@/components/ui/Button";
import type { AdminApplicationRecord } from "@/types/admin-application";

type ApplicationRowActionsProps = {
  application: AdminApplicationRecord;
  onUpdateStatus: (application: AdminApplicationRecord) => void;
};

function menuLinkClass(disabled = false) {
  return `flex items-center gap-2 px-3 py-2 text-sm font-medium ${
    disabled
      ? "pointer-events-none text-slate-400"
      : "text-slate-700 hover:bg-slate-50"
  }`;
}

function menuButtonClass() {
  return "flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50";
}

function getApplicantId(application: AdminApplicationRecord) {
  if (typeof application.applicantId === "string") return application.applicantId;
  return application.applicantId?._id;
}

function getJobId(application: AdminApplicationRecord) {
  if (typeof application.jobId === "string") return application.jobId;
  return application.jobId?._id;
}

function getCompanyId(application: AdminApplicationRecord) {
  if (typeof application.companyId === "string") return application.companyId;
  if (application.companyId?._id) return application.companyId._id;
  if (typeof application.jobId === "object") {
    const companyId = application.jobId?.companyId;
    if (typeof companyId === "string") return companyId;
    return companyId?._id;
  }
  return undefined;
}

function getEmployerId(application: AdminApplicationRecord) {
  if (typeof application.employerId === "string") return application.employerId;
  return application.employerId?._id;
}

export default function ApplicationRowActions({
  application,
  onUpdateStatus,
}: ApplicationRowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const applicantId = getApplicantId(application);
  const jobId = getJobId(application);
  const companyId = getCompanyId(application);
  const employerId = getEmployerId(application);
  const resumeHref = application.resumeUrl ?? application.resume;

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative inline-flex justify-end">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="size-9 p-0"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open application actions"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-10 z-20 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-950/10"
        >
          <Link
            role="menuitem"
            href={`/admin/applications/${application._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <Eye className="size-4" aria-hidden="true" />
            View Application Details
          </Link>
          <Link
            role="menuitem"
            href={applicantId ? `/admin/users/${applicantId}` : "#"}
            className={menuLinkClass(!applicantId)}
            onClick={() => setOpen(false)}
          >
            <UserRound className="size-4" aria-hidden="true" />
            View Applicant Profile
          </Link>
          <a
            role="menuitem"
            href={resumeHref || "#"}
            target={resumeHref ? "_blank" : undefined}
            rel={resumeHref ? "noreferrer" : undefined}
            className={menuLinkClass(!resumeHref)}
            onClick={() => setOpen(false)}
          >
            <FileText className="size-4" aria-hidden="true" />
            View Resume
          </a>
          <a
            role="menuitem"
            href={resumeHref || "#"}
            download={Boolean(resumeHref)}
            className={menuLinkClass(!resumeHref)}
            onClick={() => setOpen(false)}
          >
            <Download className="size-4" aria-hidden="true" />
            Download Resume
          </a>
          <Link
            role="menuitem"
            href={jobId ? `/admin/jobs/${jobId}` : "#"}
            className={menuLinkClass(!jobId)}
            onClick={() => setOpen(false)}
          >
            <BriefcaseBusiness className="size-4" aria-hidden="true" />
            View Job Details
          </Link>
          <Link
            role="menuitem"
            href={companyId ? `/admin/companies/${companyId}` : "#"}
            className={menuLinkClass(!companyId)}
            onClick={() => setOpen(false)}
          >
            <Building2 className="size-4" aria-hidden="true" />
            View Company Details
          </Link>
          <Link
            role="menuitem"
            href={employerId ? `/admin/employers/${employerId}` : "#"}
            className={menuLinkClass(!employerId)}
            onClick={() => setOpen(false)}
          >
            <UserRound className="size-4" aria-hidden="true" />
            View Employer Details
          </Link>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onUpdateStatus(application);
            }}
          >
            <Clock3 className="size-4" aria-hidden="true" />
            Update Application Status
          </button>
          <button
            type="button"
            role="menuitem"
            disabled
            title="Interview information will be enabled when interview routes are connected."
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
          >
            <Clock3 className="size-4" aria-hidden="true" />
            View Interview Information
          </button>
          <button
            type="button"
            role="menuitem"
            disabled
            title="Application history view will be enabled when audit history endpoints are available."
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
          >
            <History className="size-4" aria-hidden="true" />
            Review Application History
          </button>
        </div>
      ) : null}
    </div>
  );
}
