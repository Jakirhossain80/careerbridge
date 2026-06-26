"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Download,
  FileText,
  MoreHorizontal,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import type {
  AdminJobSeeker,
  AdminJobSeekerStatus,
} from "@/types/admin-job-seeker.types";

type JobSeekerRowActionsProps = {
  jobSeeker: AdminJobSeeker;
  onChangeStatus: (
    jobSeeker: AdminJobSeeker,
    status: AdminJobSeekerStatus | "unblock",
  ) => void;
};

export default function JobSeekerRowActions({
  jobSeeker,
  onChangeStatus,
}: JobSeekerRowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const resumeUrl = jobSeeker.resume?.fileUrl;

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
        aria-label={`Open actions for ${jobSeeker.name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-10 z-20 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-950/10"
        >
          <Link
            role="menuitem"
            href={`/admin/users/${jobSeeker._id}`}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            View Job Seeker Details
          </Link>
          <Link
            role="menuitem"
            href={`/admin/users/${jobSeeker._id}`}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            View Profile
          </Link>
          {resumeUrl ? (
            <>
              <a
                role="menuitem"
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <FileText className="size-4" aria-hidden="true" />
                View Resume
              </a>
              <a
                role="menuitem"
                href={resumeUrl}
                download
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <Download className="size-4" aria-hidden="true" />
                Download Resume
              </a>
            </>
          ) : (
            <button
              type="button"
              role="menuitem"
              disabled
              className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
            >
              Resume unavailable
            </button>
          )}
          <Link
            role="menuitem"
            href={`/admin/users/${jobSeeker._id}`}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Edit Account Information
          </Link>
          {jobSeeker.status !== "active" ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setOpen(false);
                onChangeStatus(jobSeeker, "active");
              }}
            >
              <UserCheck className="size-4" aria-hidden="true" />
              Activate Job Seeker
            </button>
          ) : null}
          {jobSeeker.status !== "suspended" ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setOpen(false);
                onChangeStatus(jobSeeker, "suspended");
              }}
            >
              Suspend Job Seeker
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
            onClick={() => {
              setOpen(false);
              onChangeStatus(
                jobSeeker,
                jobSeeker.status === "blocked" ? "unblock" : "blocked",
              );
            }}
          >
            <ShieldAlert className="size-4" aria-hidden="true" />
            {jobSeeker.status === "blocked"
              ? "Unblock Job Seeker"
              : "Block Job Seeker"}
          </button>
          <Link
            role="menuitem"
            href={`/admin/applications?search=${encodeURIComponent(jobSeeker.email)}`}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            View Related Applications
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled
            title="Dedicated activity view will be enabled when the activity route is available."
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
          >
            <Activity className="size-4" aria-hidden="true" />
            View Activity
          </button>
        </div>
      ) : null}
    </div>
  );
}
