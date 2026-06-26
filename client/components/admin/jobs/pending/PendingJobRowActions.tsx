"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Archive,
  Building2,
  ClipboardCheck,
  Edit,
  Eye,
  ExternalLink,
  FileWarning,
  MoreHorizontal,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import type {
  AdminJob,
  AdminJobApprovalStatus,
  AdminJobStatus,
} from "@/types/admin-job.types";

type PendingJobRowActionsProps = {
  job: AdminJob;
  onChangeStatus: (job: AdminJob, status: AdminJobStatus) => void;
  onChangeApproval: (job: AdminJob, status: AdminJobApprovalStatus) => void;
  onRequestChanges: (job: AdminJob) => void;
};

function menuLinkClass() {
  return "flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";
}

function menuButtonClass(danger = false) {
  return `flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium ${
    danger ? "text-red-700 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
  }`;
}

function getCompanyId(job: AdminJob) {
  if (typeof job.companyId === "string") return job.companyId;
  return job.companyId?._id;
}

function getEmployerId(job: AdminJob) {
  if (typeof job.employerId === "string") return job.employerId;
  return job.employerId?._id;
}

export default function PendingJobRowActions({
  job,
  onChangeStatus,
  onChangeApproval,
  onRequestChanges,
}: PendingJobRowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const companyId = getCompanyId(job);
  const employerId = getEmployerId(job);

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
        aria-label={`Open review actions for ${job.title}`}
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
            href={`/admin/jobs/${job._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <Eye className="size-4" aria-hidden="true" />
            View Job Details
          </Link>
          <Link
            role="menuitem"
            href={`/jobs/${job.slug ?? job._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            View Public Job Preview
          </Link>
          <Link
            role="menuitem"
            href={`/admin/jobs/${job._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <ClipboardCheck className="size-4" aria-hidden="true" />
            Review Job Content
          </Link>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeApproval(job, "approved");
            }}
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            Approve Job
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass(true)}
            onClick={() => {
              setOpen(false);
              onChangeApproval(job, "rejected");
            }}
          >
            <XCircle className="size-4" aria-hidden="true" />
            Reject Job
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onRequestChanges(job);
            }}
          >
            <FileWarning className="size-4" aria-hidden="true" />
            Request Changes
          </button>
          <Link
            role="menuitem"
            href={`/admin/jobs/${job._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <Edit className="size-4" aria-hidden="true" />
            Edit Job Information
          </Link>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeStatus(job, "active");
            }}
          >
            <PlayCircle className="size-4" aria-hidden="true" />
            Activate Job
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeStatus(job, "archived");
            }}
          >
            <Archive className="size-4" aria-hidden="true" />
            Archive Job
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass(true)}
            onClick={() => {
              setOpen(false);
              onChangeStatus(job, "closed");
            }}
          >
            <XCircle className="size-4" aria-hidden="true" />
            Close Job
          </button>
          <button
            type="button"
            role="menuitem"
            disabled
            title="Returning to the queue will be enabled when request-change workflow APIs are available."
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Return to Queue
          </button>
          {employerId ? (
            <Link
              role="menuitem"
              href={`/admin/employers/${employerId}`}
              className={menuLinkClass()}
              onClick={() => setOpen(false)}
            >
              <UserRound className="size-4" aria-hidden="true" />
              View Employer Information
            </Link>
          ) : null}
          {companyId ? (
            <Link
              role="menuitem"
              href={`/admin/companies/${companyId}`}
              className={menuLinkClass()}
              onClick={() => setOpen(false)}
            >
              <Building2 className="size-4" aria-hidden="true" />
              View Company Information
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
