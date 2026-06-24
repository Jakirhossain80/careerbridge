"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import RoleBadge from "@/components/admin/RoleBadge";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import Select from "@/components/ui/Select";
import type { TableColumn } from "@/components/ui/Table";
import {
  adminQueryKeys,
  approveAdminEmployer,
  approveAdminJob,
  archiveAdminJob,
  blockAdminUser,
  changeAdminUserRole,
  getAdminApplications,
  getAdminEmployers,
  getAdminJobs,
  getAdminReports,
  getAdminUsers,
  rejectAdminEmployer,
  rejectAdminJob,
  unblockAdminUser,
  updateAdminApplicationStatus,
  updateAdminReportStatus,
} from "@/services/admin.service";
import type {
  AdminApplication,
  AdminEmployer,
  AdminJob,
  AdminListParams,
  AdminMeta,
  AdminReport,
  AdminRole,
  AdminUser,
} from "@/types/admin.types";

type ResourceKind = "users" | "employers" | "jobs" | "applications" | "reports";

type ActionState = {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
} | null;

const roleOptions = [
  { label: "Job Seeker", value: "job_seeker" },
  { label: "Employer", value: "employer" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super_admin" },
];

const userStatuses = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Blocked", value: "blocked" },
];

const approvalStatuses = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const jobStatuses = [
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
  { label: "Archived", value: "archived" },
];

const applicationStatuses = [
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "under_review" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Rejected", value: "rejected" },
  { label: "Hired", value: "hired" },
];

const reportStatuses = [
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Resolved", value: "resolved" },
  { label: "Dismissed", value: "dismissed" },
];

function formatDate(value?: string) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function createDetailLink(href: string) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
    >
      <Eye className="size-4" aria-hidden="true" />
      View
    </Link>
  );
}

export default function AdminListPage({ resource }: { resource: ResourceKind }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<ActionState>(null);

  const filters: AdminListParams = useMemo(
    () => ({
      search: search || undefined,
      status: status || undefined,
      role: resource === "users" ? role || undefined : undefined,
      page,
      limit: 10,
      sortBy: "-createdAt",
    }),
    [page, resource, role, search, status],
  );

  const query = useQuery<Record<string, unknown>>({
    queryKey:
      resource === "users"
        ? adminQueryKeys.users(filters)
        : resource === "employers"
          ? adminQueryKeys.employers(filters)
          : resource === "jobs"
            ? adminQueryKeys.jobs(filters)
            : resource === "applications"
              ? adminQueryKeys.applications(filters)
              : adminQueryKeys.reports(filters),
    queryFn: async () => {
      if (resource === "users") {
        return getAdminUsers(filters) as Promise<Record<string, unknown>>;
      }
      if (resource === "employers") {
        return getAdminEmployers(filters) as Promise<Record<string, unknown>>;
      }
      if (resource === "jobs") {
        return getAdminJobs(filters) as Promise<Record<string, unknown>>;
      }
      if (resource === "applications") {
        return getAdminApplications(filters) as Promise<Record<string, unknown>>;
      }
      return getAdminReports(filters) as Promise<Record<string, unknown>>;
    },
  });

  const mutation = useMutation({
    mutationFn: async (run: () => Promise<unknown>) => run(),
    onSuccess: async () => {
      setAction(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      await queryClient.invalidateQueries({ queryKey: [`admin-${resource}`] });
    },
  });

  const runAction = (nextAction: ActionState) => setAction(nextAction);

  const data = query.data ?? {};
  const rows =
    resource === "users"
      ? ((data as { users?: AdminUser[] }).users ?? [])
      : resource === "employers"
        ? ((data as { employers?: AdminEmployer[] }).employers ?? [])
        : resource === "jobs"
          ? ((data as { jobs?: AdminJob[] }).jobs ?? [])
          : resource === "applications"
            ? ((data as { applications?: AdminApplication[] }).applications ?? [])
            : ((data as { reports?: AdminReport[] }).reports ?? []);
  const meta = (data as { meta?: AdminMeta }).meta;

  const columns = useMemo(() => {
    if (resource === "users") {
      return [
        { key: "name", header: "Name", render: (item: AdminUser) => item.name },
        { key: "email", header: "Email", render: (item: AdminUser) => item.email },
        { key: "role", header: "Role", render: (item: AdminUser) => <RoleBadge role={item.role} /> },
        {
          key: "status",
          header: "Status",
          render: (item: AdminUser) => <AdminStatusBadge status={item.status} />,
        },
        {
          key: "changeRole",
          header: "Change Role",
          render: (item: AdminUser) => (
            <Select
              aria-label="Change role"
              value={item.role}
              className="h-10 min-w-36"
              onChange={(event) =>
                runAction({
                  title: "Change user role",
                  description: `Change ${item.email} to ${event.target.value.replace(/_/g, " ")}.`,
                  confirmLabel: "Change role",
                  onConfirm: () =>
                    mutation.mutate(() =>
                      changeAdminUserRole(item._id, event.target.value as AdminRole),
                    ),
                })
              }
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          ),
        },
        {
          key: "actions",
          header: "Actions",
          render: (item: AdminUser) => (
            <div className="flex items-center gap-2">
              {createDetailLink(`/admin/users/${item._id}`)}
              <Button
                variant={item.status === "blocked" ? "outline" : "danger"}
                size="sm"
                onClick={() =>
                  runAction({
                    title: item.status === "blocked" ? "Unblock user" : "Block user",
                    description: `${item.status === "blocked" ? "Restore" : "Restrict"} access for ${item.email}.`,
                    confirmLabel: item.status === "blocked" ? "Unblock" : "Block",
                    destructive: item.status !== "blocked",
                    onConfirm: () =>
                      mutation.mutate(() =>
                        item.status === "blocked"
                          ? unblockAdminUser(item._id)
                          : blockAdminUser(item._id),
                      ),
                  })
                }
              >
                {item.status === "blocked" ? "Unblock" : "Block"}
              </Button>
            </div>
          ),
        },
      ] satisfies Array<TableColumn<AdminUser>>;
    }

    if (resource === "employers") {
      return [
        { key: "name", header: "Company", render: (item: AdminEmployer) => item.companyName ?? item.name },
        { key: "owner", header: "Owner", render: (item: AdminEmployer) => item.ownerEmail ?? item.ownerId?.email ?? "Not available" },
        { key: "industry", header: "Industry", render: (item: AdminEmployer) => item.industry ?? "Not set" },
        { key: "status", header: "Status", render: (item: AdminEmployer) => <AdminStatusBadge status={item.verificationStatus ?? item.status} /> },
        {
          key: "actions",
          header: "Actions",
          render: (item: AdminEmployer) => (
            <div className="flex items-center gap-2">
              {createDetailLink(`/admin/employers/${item._id}`)}
              <Button size="sm" variant="secondary" onClick={() => runAction({
                title: "Approve employer",
                description: `Approve ${item.companyName ?? item.name}.`,
                confirmLabel: "Approve",
                onConfirm: () => mutation.mutate(() => approveAdminEmployer(item._id)),
              })}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => runAction({
                title: "Reject employer",
                description: `Reject ${item.companyName ?? item.name}.`,
                confirmLabel: "Reject",
                destructive: true,
                onConfirm: () => mutation.mutate(() => rejectAdminEmployer(item._id)),
              })}>Reject</Button>
            </div>
          ),
        },
      ] satisfies Array<TableColumn<AdminEmployer>>;
    }

    if (resource === "jobs") {
      return [
        { key: "title", header: "Job", render: (item: AdminJob) => item.title },
        { key: "company", header: "Company", render: (item: AdminJob) => item.companyName ?? "Not set" },
        { key: "category", header: "Category", render: (item: AdminJob) => item.category ?? "Not set" },
        { key: "status", header: "Status", render: (item: AdminJob) => <AdminStatusBadge status={item.status} /> },
        {
          key: "actions",
          header: "Actions",
          render: (item: AdminJob) => (
            <div className="flex items-center gap-2">
              {createDetailLink(`/admin/jobs/${item._id}`)}
              <Button size="sm" variant="secondary" onClick={() => runAction({
                title: "Approve job",
                description: `Approve ${item.title}.`,
                confirmLabel: "Approve",
                onConfirm: () => mutation.mutate(() => approveAdminJob(item._id)),
              })}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => runAction({
                title: "Reject job",
                description: `Reject ${item.title}.`,
                confirmLabel: "Reject",
                destructive: true,
                onConfirm: () => mutation.mutate(() => rejectAdminJob(item._id)),
              })}>Reject</Button>
              <Button size="sm" variant="outline" onClick={() => runAction({
                title: "Archive job",
                description: `Archive ${item.title}.`,
                confirmLabel: "Archive",
                onConfirm: () => mutation.mutate(() => archiveAdminJob(item._id)),
              })}>Archive</Button>
            </div>
          ),
        },
      ] satisfies Array<TableColumn<AdminJob>>;
    }

    if (resource === "applications") {
      return [
        { key: "candidate", header: "Candidate", render: (item: AdminApplication) => item.applicantName ?? item.applicantEmail ?? "Candidate" },
        { key: "job", header: "Job", render: (item: AdminApplication) => item.jobId?.title ?? "Not available" },
        { key: "status", header: "Status", render: (item: AdminApplication) => <AdminStatusBadge status={item.status} /> },
        { key: "createdAt", header: "Applied", render: (item: AdminApplication) => formatDate(item.createdAt) },
        {
          key: "actions",
          header: "Actions",
          render: (item: AdminApplication) => (
            <div className="flex items-center gap-2">
              {createDetailLink(`/admin/applications/${item._id}`)}
              <Select
                aria-label="Update application status"
                value={item.status}
                className="h-10 min-w-40"
                onChange={(event) =>
                  runAction({
                    title: "Update application",
                    description: `Set application status to ${event.target.value.replace(/_/g, " ")}.`,
                    confirmLabel: "Update",
                    onConfirm: () =>
                      mutation.mutate(() =>
                        updateAdminApplicationStatus(item._id, event.target.value),
                      ),
                  })
                }
              >
                {applicationStatuses.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          ),
        },
      ] satisfies Array<TableColumn<AdminApplication>>;
    }

    return [
      { key: "target", header: "Target", render: (item: AdminReport) => item.targetType },
      { key: "reason", header: "Reason", render: (item: AdminReport) => item.reason },
      { key: "status", header: "Status", render: (item: AdminReport) => <AdminStatusBadge status={item.status} /> },
      { key: "createdAt", header: "Created", render: (item: AdminReport) => formatDate(item.createdAt) },
      {
        key: "actions",
        header: "Actions",
        render: (item: AdminReport) => (
          <div className="flex items-center gap-2">
            {createDetailLink(`/admin/reports/${item._id}`)}
            <Select
              aria-label="Update report status"
              value={item.status}
              className="h-10 min-w-36"
              onChange={(event) =>
                runAction({
                  title: "Update report",
                  description: `Set report status to ${event.target.value}.`,
                  confirmLabel: "Update",
                  onConfirm: () =>
                    mutation.mutate(() =>
                      updateAdminReportStatus(item._id, event.target.value),
                    ),
                })
              }
            >
              {reportStatuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        ),
      },
    ] satisfies Array<TableColumn<AdminReport>>;
  }, [mutation, resource]);

  const title = resource.charAt(0).toUpperCase() + resource.slice(1);
  const statusOptions =
    resource === "users"
      ? userStatuses
      : resource === "employers"
        ? approvalStatuses
        : resource === "jobs"
          ? jobStatuses
          : resource === "applications"
            ? applicationStatuses
            : reportStatuses;

  return (
    <main className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted">Monitor and moderate platform {resource}.</p>
      </div>
      <AdminFilterBar
        search={search}
        status={status}
        role={role}
        roleOptions={resource === "users" ? roleOptions : undefined}
        statusOptions={statusOptions}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        onRoleChange={(value) => {
          setPage(1);
          setRole(value);
        }}
        onStatusChange={(value) => {
          setPage(1);
          setStatus(value);
        }}
      />
      {query.isError ? (
        <ErrorState title={`${title} unavailable`} message="The records could not be loaded." />
      ) : (
        <AdminDataTable
          columns={columns as unknown as Array<TableColumn<Record<string, ReactNode>>>}
          data={rows as unknown as Array<Record<string, ReactNode>>}
          loading={query.isLoading}
          emptyMessage={`No ${resource} found.`}
          meta={meta}
          onPageChange={setPage}
          getRowKey={(item) => String(item._id)}
        />
      )}
      <ConfirmActionModal
        open={Boolean(action)}
        title={action?.title ?? ""}
        description={action?.description ?? ""}
        confirmLabel={action?.confirmLabel}
        destructive={action?.destructive}
        isLoading={mutation.isPending}
        onClose={() => setAction(null)}
        onConfirm={() => action?.onConfirm()}
      />
    </main>
  );
}
