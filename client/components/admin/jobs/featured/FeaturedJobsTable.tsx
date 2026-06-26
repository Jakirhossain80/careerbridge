"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Edit3,
  Eye,
  MoreHorizontal,
  PauseCircle,
  Star,
  Trash2,
} from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type {
  AdminFeaturedJob,
  FeaturedPromotionPriority,
  FeaturedPromotionStatus,
} from "@/types/admin-featured-job";
import type { AdminMeta } from "@/types/admin.types";

type FeaturedJobsTableProps = {
  featuredJobs: AdminFeaturedJob[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedPromotionIds: string[];
  onPageChange: (page: number) => void;
  onSelectionChange: (promotionIds: string[]) => void;
  onChangePriority: (
    featuredJob: AdminFeaturedJob,
    priority: FeaturedPromotionPriority,
  ) => void;
  onChangeStatus: (
    featuredJob: AdminFeaturedJob,
    status: FeaturedPromotionStatus,
  ) => void;
  onRemove: (featuredJob: AdminFeaturedJob) => void;
};

const priorityVariant: Record<
  FeaturedPromotionPriority,
  "primary" | "success" | "warning" | "danger" | "neutral"
> = {
  standard: "neutral",
  medium: "primary",
  high: "warning",
  ultra: "danger",
};

function formatDate(value?: string) {
  if (!value) return "Not set";

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

function getLogo(featuredJob: AdminFeaturedJob) {
  return featuredJob.company?.logo ?? featuredJob.company?.logoUrl;
}

function getCtr(featuredJob: AdminFeaturedJob) {
  if (featuredJob.impressions <= 0) return 0;
  return (featuredJob.clicks / featuredJob.impressions) * 100;
}

function RowActions({
  featuredJob,
  onChangePriority,
  onChangeStatus,
  onRemove,
}: {
  featuredJob: AdminFeaturedJob;
  onChangePriority: FeaturedJobsTableProps["onChangePriority"];
  onChangeStatus: FeaturedJobsTableProps["onChangeStatus"];
  onRemove: FeaturedJobsTableProps["onRemove"];
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const companyHref = featuredJob.companyId
    ? `/admin/companies/${featuredJob.companyId}`
    : "/admin/companies";

  return (
    <div ref={menuRef} className="relative inline-flex justify-end">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="size-9 p-0"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Open featured job actions for ${featuredJob.title}`}
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
            href={`/admin/jobs/${featuredJob.jobId}`}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <Eye className="size-4" aria-hidden="true" />
            View Job Details
          </Link>
          <Link
            role="menuitem"
            href={companyHref}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <Building2 className="size-4" aria-hidden="true" />
            View Company Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setOpen(false);
              onChangeStatus(featuredJob, "paused");
            }}
          >
            <PauseCircle className="size-4" aria-hidden="true" />
            Pause Promotion
          </button>
          {(["standard", "medium", "high", "ultra"] as FeaturedPromotionPriority[]).map(
            (priority) => (
              <button
                key={priority}
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => {
                  setOpen(false);
                  onChangePriority(featuredJob, priority);
                }}
              >
                <Edit3 className="size-4" aria-hidden="true" />
                Set {priority} priority
              </button>
            ),
          )}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
            onClick={() => {
              setOpen(false);
              onRemove(featuredJob);
            }}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove from Featured
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function FeaturedJobsTable({
  featuredJobs,
  meta,
  loading = false,
  selectedPromotionIds,
  onPageChange,
  onSelectionChange,
  onChangePriority,
  onChangeStatus,
  onRemove,
}: FeaturedJobsTableProps) {
  const selectableIds = featuredJobs.map((featuredJob) => featuredJob.promotionId);
  const allVisibleSelected =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedPromotionIds.includes(id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      onSelectionChange(
        selectedPromotionIds.filter((id) => !selectableIds.includes(id)),
      );
      return;
    }

    onSelectionChange(Array.from(new Set([...selectedPromotionIds, ...selectableIds])));
  }

  function togglePromotion(promotionId: string) {
    if (selectedPromotionIds.includes(promotionId)) {
      onSelectionChange(selectedPromotionIds.filter((id) => id !== promotionId));
      return;
    }

    onSelectionChange([...selectedPromotionIds, promotionId]);
  }

  const columns: Array<TableColumn<AdminFeaturedJob>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleAllVisible}
          aria-label="Select all visible featured jobs"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      render: (featuredJob) => (
        <input
          type="checkbox"
          checked={selectedPromotionIds.includes(featuredJob.promotionId)}
          onChange={() => togglePromotion(featuredJob.promotionId)}
          aria-label={`Select ${featuredJob.title}`}
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      className: "w-12",
      headerClassName: "w-12",
    },
    {
      key: "job",
      header: "Job",
      render: (featuredJob) => (
        <div className="min-w-80">
          <Link
            href={`/admin/jobs/${featuredJob.jobId}`}
            className="font-semibold text-slate-950 hover:text-primary"
          >
            {featuredJob.title}
          </Link>
          <p className="mt-0.5 max-w-72 truncate text-xs text-slate-500">
            {featuredJob.slug ? `/${featuredJob.slug}` : `ID: ${featuredJob.jobId}`}
          </p>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      render: (featuredJob) => {
        const logo = getLogo(featuredJob);
        const companyName = featuredJob.companyName ?? "Company not set";

        return (
          <div className="flex min-w-64 items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt=""
                className="size-10 rounded-md border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                {getInitials(companyName)}
              </div>
            )}
            <p className="font-medium text-slate-900">{companyName}</p>
          </div>
        );
      },
    },
    {
      key: "priority",
      header: "Priority",
      render: (featuredJob) => (
        <Badge variant={priorityVariant[featuredJob.priority]} className="capitalize">
          <Star className="mr-1 size-3" aria-hidden="true" />
          {featuredJob.priority}
        </Badge>
      ),
    },
    {
      key: "impressions",
      header: "Impressions",
      render: (featuredJob) => featuredJob.impressions.toLocaleString(),
    },
    {
      key: "clicks",
      header: "Clicks",
      render: (featuredJob) => featuredJob.clicks.toLocaleString(),
    },
    {
      key: "performance",
      header: "Performance",
      render: (featuredJob) => {
        const ctr = getCtr(featuredJob);

        return (
          <div className="min-w-40">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">CTR</span>
              <span className="text-xs font-semibold text-slate-900">
                {ctr.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, ctr * 10)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "duration",
      header: "Duration",
      render: (featuredJob) => (
        <div className="min-w-44">
          <p>{featuredJob.durationDays ? `${featuredJob.durationDays} days` : "Not tracked"}</p>
          <p className="mt-1 text-xs text-muted">
            Ends {formatDate(featuredJob.endsAt)}
          </p>
        </div>
      ),
    },
    {
      key: "remaining",
      header: "Days Remaining",
      render: (featuredJob) =>
        featuredJob.daysRemaining === undefined
          ? "Not tracked"
          : featuredJob.daysRemaining.toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      render: (featuredJob) => <AdminStatusBadge status={featuredJob.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (featuredJob) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/jobs/${featuredJob.jobId}`} tabIndex={-1}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0"
              aria-label={`View ${featuredJob.title}`}
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <RowActions
            featuredJob={featuredJob}
            onChangePriority={onChangePriority}
            onChangeStatus={onChangeStatus}
            onRemove={onRemove}
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
      data={featuredJobs}
      loading={loading}
      emptyMessage="No featured jobs found. Feature a job to start promoting it."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(featuredJob) => featuredJob.promotionId}
    />
  );
}
