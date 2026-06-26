"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import CompanyRowActions from "@/components/admin/companies/CompanyRowActions";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type {
  AdminCompany,
  AdminCompanyStatus,
  AdminCompanyVerificationStatus,
} from "@/types/admin-company.types";
import type { AdminMeta, AdminUser } from "@/types/admin.types";

type CompaniesTableProps = {
  companies: AdminCompany[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedCompanyIds: string[];
  onPageChange: (page: number) => void;
  onSelectionChange: (companyIds: string[]) => void;
  onChangeStatus: (company: AdminCompany, status: AdminCompanyStatus | "unblock") => void;
  onChangeVerification: (
    company: AdminCompany,
    status: AdminCompanyVerificationStatus,
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
  const source = value?.trim() || "Company";
  const parts = source.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "CO";
}

function getCompanyName(company: AdminCompany) {
  return company.companyName ?? company.name;
}

function getLogo(company: AdminCompany) {
  return company.logo ?? company.logoUrl;
}

function getOwner(company: AdminCompany) {
  return typeof company.ownerId === "object" && company.ownerId
    ? (company.ownerId as AdminUser)
    : undefined;
}

function getOwnerUserId(company: AdminCompany) {
  if (typeof company.ownerId === "string") return company.ownerId;
  return company.ownerId?._id;
}

function getOwnerName(company: AdminCompany) {
  return getOwner(company)?.name ?? "Not assigned";
}

function getOwnerEmail(company: AdminCompany) {
  return company.email ?? company.ownerEmail ?? getOwner(company)?.email ?? "No email";
}

function getCompanyStatus(company: AdminCompany) {
  return company.companyStatus ?? getOwner(company)?.status ?? "pending";
}

function normalizeVerification(status?: AdminCompanyVerificationStatus) {
  if (status === "approved") return "verified";
  if (status === "pending") return "pending_verification";
  if (status === "blocked") return "rejected";
  return status ?? "unverified";
}

export default function CompaniesTable({
  companies,
  meta,
  loading = false,
  selectedCompanyIds,
  onPageChange,
  onSelectionChange,
  onChangeStatus,
  onChangeVerification,
}: CompaniesTableProps) {
  const selectableIds = companies.map((company) => company._id);
  const allVisibleSelected =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedCompanyIds.includes(id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      onSelectionChange(
        selectedCompanyIds.filter((id) => !selectableIds.includes(id)),
      );
      return;
    }

    onSelectionChange(Array.from(new Set([...selectedCompanyIds, ...selectableIds])));
  }

  function toggleCompany(companyId: string) {
    if (selectedCompanyIds.includes(companyId)) {
      onSelectionChange(selectedCompanyIds.filter((id) => id !== companyId));
      return;
    }

    onSelectionChange([...selectedCompanyIds, companyId]);
  }

  const columns: Array<TableColumn<AdminCompany>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleAllVisible}
          aria-label="Select all visible companies"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      render: (company) => (
        <input
          type="checkbox"
          checked={selectedCompanyIds.includes(company._id)}
          onChange={() => toggleCompany(company._id)}
          aria-label={`Select ${getCompanyName(company)}`}
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      className: "w-12",
      headerClassName: "w-12",
    },
    {
      key: "company",
      header: "Company",
      render: (company) => {
        const companyName = getCompanyName(company);
        const logo = getLogo(company);

        return (
          <div className="flex min-w-80 items-center gap-3">
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
                href={`/admin/companies/${company._id}`}
                className="font-semibold text-slate-950 hover:text-primary"
              >
                {companyName}
              </Link>
              <p className="mt-0.5 max-w-64 truncate text-xs text-slate-500">
                {company.slug ? `/${company.slug}` : `ID: ${company._id}`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "industry",
      header: "Industry",
      render: (company) => (
        <div className="min-w-36">
          <p>{company.industry ?? "Not set"}</p>
          <p className="mt-1 text-xs text-muted">
            {company.companySize ?? company.size ?? "Size not set"}
          </p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (company) => (
        <div className="min-w-64">
          {company.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="block max-w-64 truncate font-medium text-primary hover:underline"
            >
              {company.website}
            </a>
          ) : (
            <p className="text-muted">No website</p>
          )}
          <p className="mt-1 max-w-64 truncate text-xs text-slate-500">
            {getOwnerEmail(company)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {company.phone ?? "No phone"}
          </p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (company) => (
        <span className="block min-w-40">
          {company.location ?? company.headquarters ?? company.address ?? "Not set"}
        </span>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (company) => (
        <div className="min-w-48">
          <p className="font-medium text-slate-900">{getOwnerName(company)}</p>
          <p className="mt-1 max-w-48 truncate text-xs text-muted">
            {getOwner(company)?.email ?? company.ownerEmail ?? "No owner email"}
          </p>
        </div>
      ),
    },
    {
      key: "verification",
      header: "Verification",
      render: (company) => (
        <AdminStatusBadge
          status={normalizeVerification(company.verificationStatus ?? company.status)}
        />
      ),
    },
    {
      key: "companyStatus",
      header: "Status",
      render: (company) => <AdminStatusBadge status={getCompanyStatus(company)} />,
    },
    {
      key: "activeJobs",
      header: "Active Jobs",
      render: (company) => (
        <span className="font-semibold text-slate-900">
          {(company.activeJobsCount ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Registered",
      render: (company) => formatDate(company.createdAt),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (company) => formatDate(company.updatedAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (company) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/companies/${company._id}`} tabIndex={-1}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0"
              aria-label={`View ${getCompanyName(company)}`}
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <CompanyRowActions
            company={company}
            ownerUserId={getOwnerUserId(company)}
            onChangeStatus={onChangeStatus}
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
      data={companies}
      loading={loading}
      emptyMessage="No companies found. Try adjusting your search or filters."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(company) => company._id}
    />
  );
}
