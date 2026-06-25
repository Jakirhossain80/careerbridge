"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import AdminDataTable from "@/components/admin/AdminDataTable";
import RoleBadge from "@/components/admin/RoleBadge";
import UserStatusBadge from "@/components/admin/UserStatusBadge";
import UserActionsMenu from "@/components/admin/users/UserActionsMenu";
import Button from "@/components/ui/Button";
import type { TableColumn } from "@/components/ui/Table";
import type { AdminMeta, AdminUser, UserRole, UserStatus } from "@/types/admin-user.types";

type UsersTableProps = {
  users: AdminUser[];
  meta?: AdminMeta;
  loading?: boolean;
  selectedUserIds: string[];
  currentAdminRole?: UserRole;
  currentFirebaseUid?: string;
  currentEmail?: string | null;
  onPageChange: (page: number) => void;
  onSelectionChange: (userIds: string[]) => void;
  onChangeRole: (user: AdminUser) => void;
  onChangeStatus: (user: AdminUser, status: UserStatus) => void;
  onBlockToggle: (user: AdminUser) => void;
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
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "U";
}

export default function UsersTable({
  users,
  meta,
  loading = false,
  selectedUserIds,
  currentAdminRole,
  currentFirebaseUid,
  currentEmail,
  onPageChange,
  onSelectionChange,
  onChangeRole,
  onChangeStatus,
  onBlockToggle,
}: UsersTableProps) {
  const selectableIds = users.map((user) => user._id);
  const allVisibleSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selectedUserIds.includes(id));

  function toggleAllVisible() {
    if (allVisibleSelected) {
      onSelectionChange(selectedUserIds.filter((id) => !selectableIds.includes(id)));
      return;
    }

    onSelectionChange(Array.from(new Set([...selectedUserIds, ...selectableIds])));
  }

  function toggleUser(userId: string) {
    if (selectedUserIds.includes(userId)) {
      onSelectionChange(selectedUserIds.filter((id) => id !== userId));
      return;
    }

    onSelectionChange([...selectedUserIds, userId]);
  }

  const columns: Array<TableColumn<AdminUser>> = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={toggleAllVisible}
          aria-label="Select all visible users"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      render: (user) => (
        <input
          type="checkbox"
          checked={selectedUserIds.includes(user._id)}
          onChange={() => toggleUser(user._id)}
          aria-label={`Select ${user.name}`}
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
      ),
      className: "w-12",
      headerClassName: "w-12",
    },
    {
      key: "user",
      header: "User Information",
      render: (user) => (
        <div className="flex min-w-64 items-center gap-3">
          {user.photoURL || user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL ?? user.avatar}
              alt=""
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-primary">
              {getInitials(user.name)}
            </div>
          )}
          <div>
            <Link
              href={`/admin/users/${user._id}`}
              className="font-semibold text-slate-950 hover:text-primary"
            >
              {user.name}
            </Link>
            <p className="mt-0.5 text-sm text-muted">{user.email}</p>
            <p className="mt-0.5 text-xs text-slate-400">ID: {user._id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => <RoleBadge role={user.role} />,
    },
    {
      key: "createdAt",
      header: "Join Date",
      render: (user) => formatDate(user.createdAt),
    },
    {
      key: "lastActivityAt",
      header: "Last Activity",
      render: (user) => formatDate(user.lastActivityAt ?? user.updatedAt),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (user) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/users/${user._id}`} tabIndex={-1}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0"
              aria-label={`View ${user.name}`}
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </Link>
          <UserActionsMenu
            user={user}
            currentAdminRole={currentAdminRole}
            currentFirebaseUid={currentFirebaseUid}
            currentEmail={currentEmail}
            onChangeRole={onChangeRole}
            onChangeStatus={onChangeStatus}
            onBlockToggle={onBlockToggle}
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
      data={users}
      loading={loading}
      emptyMessage="No users found. Try adjusting your search or filters."
      meta={meta}
      onPageChange={onPageChange}
      getRowKey={(user) => user._id}
    />
  );
}
