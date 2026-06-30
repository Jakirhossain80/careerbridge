import Link from "next/link";
import { Check, ExternalLink, X } from "lucide-react";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import DashboardSection from "@/components/dashboard/DashboardSection";
import { Button, EmptyState } from "@/components/ui";
import type { PendingApprovalItem } from "@/types/admin-dashboard.types";

type PendingApprovalsPanelProps = {
  approvals: PendingApprovalItem[];
  actionId?: string;
  onApprove: (item: PendingApprovalItem) => void;
  onReject: (item: PendingApprovalItem) => void;
};

function getDetailsHref(item: PendingApprovalItem) {
  return item.type === "employer"
    ? `/admin/employers/${item._id}`
    : `/admin/jobs/${item._id}`;
}

function formatDate(value?: string) {
  if (!value) return "date unavailable";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default function PendingApprovalsPanel({
  approvals,
  actionId,
  onApprove,
  onReject,
}: PendingApprovalsPanelProps) {
  return (
    <DashboardSection
      title="Pending Approvals"
      description="Employers and jobs awaiting review."
    >
      {approvals.length ? (
        <div className="space-y-3">
          {approvals.map((item) => (
            <article
              key={`${item.type}-${item._id}`}
              className="rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <AdminStatusBadge status={item.status ?? "pending"} />
                  </div>
                  <p className="mt-1 text-xs capitalize text-muted">
                    {item.type}
                    {item.subtitle ? ` - ${item.subtitle}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Submitted {formatDate(item.createdAt)}
                  </p>
                </div>
                <Link
                  href={getDetailsHref(item)}
                  className="rounded-md p-2 text-muted transition hover:bg-slate-100 hover:text-foreground"
                  aria-label={`View ${item.title}`}
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  isLoading={actionId === `approve-${item.type}-${item._id}`}
                  leftIcon={<Check className="size-4" aria-hidden="true" />}
                  onClick={() => onApprove(item)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={actionId === `reject-${item.type}-${item._id}`}
                  leftIcon={<X className="size-4" aria-hidden="true" />}
                  onClick={() => onReject(item)}
                >
                  Reject
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No pending approvals"
          description="Employer and job approvals will appear here when they need review."
          className="border-0 shadow-none"
        />
      )}
    </DashboardSection>
  );
}
