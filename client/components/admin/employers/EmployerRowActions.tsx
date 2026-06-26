"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Edit,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import type {
  AdminEmployer,
  AdminEmployerVerificationStatus,
} from "@/types/admin-employer.types";
import type { AdminUserStatus } from "@/types/admin.types";

type EmployerRowActionsProps = {
  employer: AdminEmployer;
  ownerUserId?: string;
  onChangeAccountStatus: (
    employer: AdminEmployer,
    status: AdminUserStatus | "unblock",
  ) => void;
  onChangeVerification: (
    employer: AdminEmployer,
    status: AdminEmployerVerificationStatus,
  ) => void;
};

function menuLinkClass() {
  return "flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";
}

function menuButtonClass(danger = false) {
  return `flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium ${
    danger ? "text-red-700 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
  }`;
}

export default function EmployerRowActions({
  employer,
  ownerUserId,
  onChangeAccountStatus,
  onChangeVerification,
}: EmployerRowActionsProps) {
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
          className="absolute right-0 top-10 z-20 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-950/10"
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
            <Edit className="size-4" aria-hidden="true" />
            Edit Employer Information
          </Link>
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
            Verify Employer
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
            <UserCheck className="size-4" aria-hidden="true" />
            Approve Employer Account
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass(true)}
            onClick={() => {
              setOpen(false);
              onChangeVerification(employer, "rejected");
            }}
          >
            <XCircle className="size-4" aria-hidden="true" />
            Reject Employer Verification
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
                <UserCheck className="size-4" aria-hidden="true" />
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
          <Link
            role="menuitem"
            href={`/admin/jobs?search=${encodeURIComponent(displayName)}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <BriefcaseBusiness className="size-4" aria-hidden="true" />
            View Posted Jobs
          </Link>
          <Link
            role="menuitem"
            href={`/admin/applications?search=${encodeURIComponent(displayName)}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            View Related Applications
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled
            title="Employer activity will be enabled when the activity route is available."
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
          >
            <Activity className="size-4" aria-hidden="true" />
            View Employer Activity
          </button>
          <button
            type="button"
            role="menuitem"
            disabled
            title="Employer analytics will be enabled when admin analytics routes are available."
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
          >
            <BarChart3 className="size-4" aria-hidden="true" />
            View Employer Analytics
          </button>
        </div>
      ) : null}
    </div>
  );
}
