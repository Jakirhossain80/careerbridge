"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  ClipboardCheck,
  ClipboardList,
  FileQuestion,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import type { AdminEmployerVerificationStatus } from "@/types/admin-employer.types";
import type { AdminUserStatus } from "@/types/admin.types";
import type { PendingEmployer } from "@/types/admin-employer-verification";

type PendingEmployerRowActionsProps = {
  employer: PendingEmployer;
  ownerUserId?: string;
  onChangeAccountStatus: (
    employer: PendingEmployer,
    status: AdminUserStatus | "unblock",
  ) => void;
  onChangeVerification: (
    employer: PendingEmployer,
    status: AdminEmployerVerificationStatus,
  ) => void;
  onReject: (employer: PendingEmployer) => void;
};

function menuLinkClass() {
  return "flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";
}

function menuButtonClass(danger = false) {
  return `flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium ${
    danger ? "text-red-700 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
  }`;
}

export default function PendingEmployerRowActions({
  employer,
  ownerUserId,
  onChangeAccountStatus,
  onChangeVerification,
  onReject,
}: PendingEmployerRowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const displayName = employer.companyName ?? employer.name;

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
        aria-label={`Open actions for ${displayName}`}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-10 z-20 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-950/10"
        >
          <Link
            role="menuitem"
            href={`/admin/employers/${employer._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <Building2 className="size-4" aria-hidden="true" />
            View Employer Details
          </Link>
          <Link
            role="menuitem"
            href={`/companies/${employer._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <Building2 className="size-4" aria-hidden="true" />
            View Company Profile
          </Link>
          <Link
            role="menuitem"
            href={`/admin/employers/${employer._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            Review Submitted Information
          </Link>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeVerification(employer, "approved");
            }}
          >
            <UserCheck className="size-4" aria-hidden="true" />
            Approve Employer
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass(true)}
            onClick={() => {
              setOpen(false);
              onReject(employer);
            }}
          >
            <XCircle className="size-4" aria-hidden="true" />
            Reject Employer
          </button>
          <button
            type="button"
            role="menuitem"
            disabled
            title="Requesting additional information is UI-ready and will be enabled when the backend endpoint exists."
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
          >
            <FileQuestion className="size-4" aria-hidden="true" />
            Request Additional Information
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeVerification(employer, "verified");
            }}
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            Verify Company
          </button>
          {ownerUserId ? (
            <>
              <button
                type="button"
                role="menuitem"
                className={menuButtonClass()}
                onClick={() => {
                  setOpen(false);
                  onChangeAccountStatus(employer, "active");
                }}
              >
                <ClipboardCheck className="size-4" aria-hidden="true" />
                Activate Employer
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuButtonClass()}
                onClick={() => {
                  setOpen(false);
                  onChangeAccountStatus(employer, "suspended");
                }}
              >
                Suspend Employer
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuButtonClass(true)}
                onClick={() => {
                  setOpen(false);
                  onChangeAccountStatus(employer, "blocked");
                }}
              >
                <ShieldAlert className="size-4" aria-hidden="true" />
                Block Employer
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuButtonClass()}
                onClick={() => {
                  setOpen(false);
                  onChangeAccountStatus(employer, "unblock");
                }}
              >
                Unblock Employer
              </button>
            </>
          ) : (
            <button
              type="button"
              role="menuitem"
              disabled
              className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
            >
              Account status unavailable
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
