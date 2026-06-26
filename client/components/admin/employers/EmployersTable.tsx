"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import EmployerRowActions from "@/components/admin/employers/EmployerRowActions";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type {
  AdminEmployer,
  AdminEmployerVerificationStatus,
} from "@/types/admin-employer.types";
import type { AdminMeta, AdminUser, AdminUserStatus } from "@/types/admin.types";

type EmployersTableProps = {
  employers: AdminEmployer[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedEmployerIds: string[];
  onPageChange: (page: number) => void;
  onSelectionChange: (employerIds: string[]) => void;
  onChangeAccountStatus: (
    employer: AdminEmployer,
    status: AdminUserStatus | "unblock",
  ) => void;
  onChangeVerification: (
    employer: AdminEmployer,
    status: AdminEmployerVerificationStatus,
  ) => void;
};

function formatDate(value?: string) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(value?: string) {
  const source = value?.trim() || "Employer";
  const parts = source.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "EM";
}

function getOwner(employer: AdminEmployer) {
  return typeof employer.ownerId === "object" && employer.ownerId
    ? (employer.ownerId as AdminUser)
    : undefined;
}

function getOwnerUserId(employer: AdminEmployer) {
  if (typeof employer.ownerId === "string") return employer.ownerId;
  return employer.ownerId?._id;
}

function getOwnerEmail(employer: AdminEmployer) {
  return employer.email ?? employer.ownerEmail ?? getOwner(employer)?.email ?? "No email";
}

function getOwnerName(employer: AdminEmployer) {
  return getOwner(employer)?.name ?? employer.name ?? "Employer";
}

function normalizeVerification(status?: AdminEmployerVerificationStatus) {
  if (status === "approved") return "verified";
  if (status === "pending") return "pending_verification";
  return status ?? "unverified";
}

export default function EmployersTable({
  employers,
  meta,
  loading = false,
  selectedEmployerIds,
  onPageChange,
  onSelectionChange,
  onChangeAccountStatus,
  onChangeVerification,
}: EmployersTableProps) {
  const selectableIds = employers.map((employer) => employer._id);
  const allVisibleSelected =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedEmployerIds.includes(id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      onSelectionChange(
        selectedEmployerIds.filter((id) => !selectableIds.includes(id)),
      );
      return;
    }

    onSelectionChange(Array.from(new Set([...selectedEmployerIds, ...selectableIds])));
  }

  function toggleEmployer(employerId: string) {
    if (selectedEmployerIds.includes(employerId)) {
      onSelectionChange(selectedEmployerIds.filter((id) => id !== employerId));
      return;
    }

    onSelectionChange([...selectedEmployerIds, employerId]);
  }

  const columns: Array<TableColumn<AdminEmployer>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleAllVisible}
          aria-label="Select all visible employers"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      render: (employer) => (
        <input
          type="checkbox"
          checked={selectedEmployerIds.includes(employer._id)}
          onChange={() => toggleEmployer(employer._id)}
          aria-label={`Select ${employer.companyName ?? employer.name}`}
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      className: "w-12",
      headerClassName: "w-12",
    },
    {
      key: "employer",
      header: "Employer",
      render: (employer) => {
        const ownerName = getOwnerName(employer);
        const avatar = employer.avatar ?? employer.photoURL ?? getOwner(employer)?.avatar;

        return (
          <div className="flex min-w-72 items-center gap-3">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="size-11 rounded-full object-cover" />
            ) : (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-primary">
                {getInitials(ownerName)}
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={`/admin/employers/${employer._id}`}
                className="font-semibold text-slate-950 hover:text-primary"
              >
                {ownerName}
              </Link>
              <p className="mt-0.5 text-sm text-muted">{getOwnerEmail(employer)}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {employer.phone ?? "No phone"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "company",
      header: "Company",
      render: (employer) => {
        const companyName = employer.companyName ?? employer.name;
        const logo = employer.logo ?? employer.logoUrl;

        return (
          <div className="flex min-w-72 items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt=""
                className="size-11 rounded-md border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-slate-700">
                {getInitials(companyName)}
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={`/companies/${employer._id}`}
                className="font-semibold text-slate-950 hover:text-primary"
              >
                {companyName}
              </Link>
              {employer.website ? (
                <a
                  href={employer.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 block max-w-64 truncate text-sm text-primary hover:underline"
                >
                  {employer.website}
                </a>
              ) : (
                <p className="mt-0.5 text-sm text-muted">No website</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "industry",
      header: "Industry",
      render: (employer) => (
        <div className="min-w-36">
          <p>{employer.industry ?? "Not set"}</p>
          <p className="mt-1 text-xs text-muted">
            {employer.companySize ?? employer.size ?? "Size not set"}
          </p>
        </div>
      ),
    },
    {
      key: "verification",
      header: "Verification",
      render: (employer) => (
        <AdminStatusBadge
          status={normalizeVerification(
            employer.verificationStatus ?? employer.status,
          )}
        />
      ),
    },
    {
      key: "account",
      header: "Account",
      render: (employer) => (
        <AdminStatusBadge status={getOwner(employer)?.status ?? "unknown"} />
      ),
    },
    {
      key: "activeJobs",
      header: "Active Jobs",
      render: (employer) => (
        <span className="font-semibold text-slate-900">
          {(employer.activeJobsCount ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Registered",
      render: (employer) => formatDate(employer.createdAt),
    },
    {
      key: "lastActivityAt",
      header: "Last Activity",
      render: (employer) => formatDate(employer.lastActivityAt ?? employer.updatedAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (employer) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/employers/${employer._id}`} tabIndex={-1}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0"
              aria-label={`View ${employer.companyName ?? employer.name}`}
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <EmployerRowActions
            employer={employer}
            ownerUserId={getOwnerUserId(employer)}
            onChangeAccountStatus={onChangeAccountStatus}
            onChangeVerification={onChangeVerification}
          />
        </div>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ];

  return (
    <AdminDataTable
      columns={columns}
      data={employers}
      loading={loading}
      emptyMessage="No employers found. Try adjusting your search or filters."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(employer) => employer._id}
    />
  );
}
