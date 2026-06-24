"use client";

import { useQuery } from "@tanstack/react-query";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import RoleBadge from "@/components/admin/RoleBadge";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import {
  adminQueryKeys,
  getAdminApplication,
  getAdminEmployer,
  getAdminJob,
  getAdminReport,
  getAdminUser,
} from "@/services/admin.service";

type AdminDetailPageProps = {
  resource: "user" | "employer" | "job" | "application" | "report";
  id: string;
};

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not available";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(stringifyValue).join(", ");
  if (typeof value === "object" && "name" in value) {
    return stringifyValue((value as { name?: unknown }).name);
  }
  if (typeof value === "object" && "title" in value) {
    return stringifyValue((value as { title?: unknown }).title);
  }
  return JSON.stringify(value);
}

export default function AdminDetailPage({ resource, id }: AdminDetailPageProps) {
  const query = useQuery<Record<string, unknown>>({
    queryKey:
      resource === "user"
        ? adminQueryKeys.user(id)
        : resource === "employer"
          ? adminQueryKeys.employer(id)
          : resource === "job"
            ? adminQueryKeys.job(id)
            : resource === "application"
              ? adminQueryKeys.application(id)
              : adminQueryKeys.report(id),
    queryFn: async () => {
      if (resource === "user") return getAdminUser(id) as Promise<Record<string, unknown>>;
      if (resource === "employer") return getAdminEmployer(id) as Promise<Record<string, unknown>>;
      if (resource === "job") return getAdminJob(id) as Promise<Record<string, unknown>>;
      if (resource === "application") return getAdminApplication(id) as Promise<Record<string, unknown>>;
      return getAdminReport(id) as Promise<Record<string, unknown>>;
    },
  });

  if (query.isLoading) {
    return (
      <main className="p-4 sm:p-6">
        <LoadingSkeleton rows={4} />
      </main>
    );
  }

  if (query.isError || !query.data) {
    return (
      <main className="p-4 sm:p-6">
        <ErrorState title="Record unavailable" message="This admin record could not be loaded." />
      </main>
    );
  }

  const record = query.data as Record<string, unknown>;
  const title =
    stringifyValue(record.name) !== "Not available"
      ? stringifyValue(record.name)
      : stringifyValue(record.title) !== "Not available"
        ? stringifyValue(record.title)
        : stringifyValue(record.companyName) !== "Not available"
          ? stringifyValue(record.companyName)
          : `${resource} details`;

  return (
    <main className="p-4 sm:p-6">
      <Card className="mx-auto max-w-4xl p-5">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm capitalize text-muted">{resource}</p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex gap-2">
            {typeof record.role === "string" ? <RoleBadge role={record.role} /> : null}
            {typeof record.status === "string" ? <AdminStatusBadge status={record.status} /> : null}
            {typeof record.verificationStatus === "string" ? (
              <AdminStatusBadge status={record.verificationStatus} />
            ) : null}
          </div>
        </div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          {Object.entries(record)
            .filter(([key]) => !key.startsWith("__") && key !== "_id")
            .slice(0, 24)
            .map(([key, value]) => (
              <div key={key} className="rounded-md border border-slate-200 p-3">
                <dt className="text-xs font-semibold uppercase text-muted">
                  {key.replace(/([A-Z])/g, " $1")}
                </dt>
                <dd className="mt-1 break-words text-sm text-foreground">
                  {stringifyValue(value)}
                </dd>
              </div>
            ))}
        </dl>
      </Card>
    </main>
  );
}
