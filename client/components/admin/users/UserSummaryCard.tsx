import { CalendarDays, Fingerprint, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import RoleBadge from "@/components/admin/RoleBadge";
import UserStatusBadge from "@/components/admin/UserStatusBadge";
import { Card } from "@/components/ui";
import type { AdminUser } from "@/types/admin-user.types";

type UserSummaryCardProps = {
  user: AdminUser;
};

function formatDate(value?: string) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex min-w-0 gap-3 rounded-md border border-slate-200 bg-white px-3 py-3">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-muted">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-foreground">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

export default function UserSummaryCard({ user }: UserSummaryCardProps) {
  const avatar = user.photoURL ?? user.avatar;

  return (
    <Card className="overflow-hidden">
      <div className="h-28 bg-[linear-gradient(135deg,#2563eb_0%,#0f766e_54%,#475569_100%)]" />
      <div className="-mt-12 px-5 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border-4 border-surface bg-blue-50 text-2xl font-bold text-primary shadow-sm">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {user.name}
                </h1>
                <RoleBadge role={user.role} />
                <UserStatusBadge status={user.status} />
              </div>
              <p className="mt-1 max-w-2xl text-sm font-medium text-muted">
                {user.headline || "No professional headline available."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem
            icon={<Mail className="size-4" aria-hidden="true" />}
            label="Email"
            value={user.email}
          />
          <DetailItem
            icon={<Phone className="size-4" aria-hidden="true" />}
            label="Phone"
            value={user.phone}
          />
          <DetailItem
            icon={<MapPin className="size-4" aria-hidden="true" />}
            label="Location"
            value={user.location}
          />
          <DetailItem
            icon={<CalendarDays className="size-4" aria-hidden="true" />}
            label="Registered"
            value={formatDate(user.createdAt)}
          />
          <DetailItem
            icon={<CalendarDays className="size-4" aria-hidden="true" />}
            label="Last Updated"
            value={formatDate(user.updatedAt)}
          />
          <DetailItem
            icon={<ShieldCheck className="size-4" aria-hidden="true" />}
            label="User ID"
            value={user._id}
          />
          <DetailItem
            icon={<Fingerprint className="size-4" aria-hidden="true" />}
            label="Firebase UID"
            value={user.firebaseUid}
          />
        </div>
      </div>
    </Card>
  );
}
