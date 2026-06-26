"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Edit,
  ExternalLink,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  XCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import type {
  AdminCompany,
  AdminCompanyStatus,
  AdminCompanyVerificationStatus,
} from "@/types/admin-company.types";

type CompanyRowActionsProps = {
  company: AdminCompany;
  ownerUserId?: string;
  onChangeStatus: (company: AdminCompany, status: AdminCompanyStatus | "unblock") => void;
  onChangeVerification: (
    company: AdminCompany,
    status: AdminCompanyVerificationStatus,
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

function getCompanyName(company: AdminCompany) {
  return company.companyName ?? company.name;
}

export default function CompanyRowActions({
  company,
  ownerUserId,
  onChangeStatus,
  onChangeVerification,
}: CompanyRowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const displayName = getCompanyName(company);

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
            href={`/admin/companies/${company._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <Building2 className="size-4" aria-hidden="true" />
            View Company Details
          </Link>
          <Link
            role="menuitem"
            href={`/companies/${company.slug ?? company._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            View Public Company Profile
          </Link>
          <Link
            role="menuitem"
            href={`/admin/companies/${company._id}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <Edit className="size-4" aria-hidden="true" />
            Edit Company Information
          </Link>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeVerification(company, "verified");
            }}
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            Verify Company
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeVerification(company, "verified");
            }}
          >
            <UserCheck className="size-4" aria-hidden="true" />
            Approve Company
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass(true)}
            onClick={() => {
              setOpen(false);
              onChangeVerification(company, "rejected");
            }}
          >
            <XCircle className="size-4" aria-hidden="true" />
            Reject Verification
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeStatus(company, "active");
            }}
          >
            <UserCheck className="size-4" aria-hidden="true" />
            Activate Company
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeStatus(company, "suspended");
            }}
          >
            Suspend Company
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass(true)}
            onClick={() => {
              setOpen(false);
              onChangeStatus(company, "blocked");
            }}
          >
            <ShieldAlert className="size-4" aria-hidden="true" />
            Block Company
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuButtonClass()}
            onClick={() => {
              setOpen(false);
              onChangeStatus(company, "unblock");
            }}
          >
            Unblock Company
          </button>
          {ownerUserId ? (
            <Link
              role="menuitem"
              href={`/admin/users/${ownerUserId}`}
              className={menuLinkClass()}
              onClick={() => setOpen(false)}
            >
              <User className="size-4" aria-hidden="true" />
              View Company Owner
            </Link>
          ) : (
            <button
              type="button"
              role="menuitem"
              disabled
              className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
            >
              Company owner unavailable
            </button>
          )}
          <Link
            role="menuitem"
            href={`/admin/jobs?search=${encodeURIComponent(displayName)}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <BriefcaseBusiness className="size-4" aria-hidden="true" />
            View Company Jobs
          </Link>
          <Link
            role="menuitem"
            href={`/admin/applications?search=${encodeURIComponent(displayName)}`}
            className={menuLinkClass()}
            onClick={() => setOpen(false)}
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            Review Submitted Information
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled
            title="Company analytics will be enabled when admin analytics routes are available."
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
          >
            <BarChart3 className="size-4" aria-hidden="true" />
            View Company Analytics
          </button>
        </div>
      ) : null}
    </div>
  );
}
