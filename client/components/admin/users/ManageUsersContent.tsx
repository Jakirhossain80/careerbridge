"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";

import BulkUserActionsBar from "@/components/admin/users/BulkUserActionsBar";
import ChangeUserRoleModal from "@/components/admin/users/ChangeUserRoleModal";
import UserStatusConfirmModal from "@/components/admin/users/UserStatusConfirmModal";
import UsersFilterBar from "@/components/admin/users/UsersFilterBar";
import UsersTable from "@/components/admin/users/UsersTable";
import UsersTabs from "@/components/admin/users/UsersTabs";
import Button from "@/components/ui/Button";
import ErrorState from "@/components/ui/ErrorState";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import {
  adminQueryKeys,
  blockUser,
  getAdminUsers,
  unblockUser,
  updateUserRole,
  updateUserStatus,
} from "@/services/admin.service";
import type {
  AdminUsersSortBy,
  AdminUsersTab,
  AdminUser,
  UserRole,
  UserStatus,
} from "@/types/admin-user.types";
import type { AdminListParams } from "@/types/admin.types";

type PendingStatusAction = {
  user: AdminUser;
  status: UserStatus | "block" | "unblock";
} | null;

const sortMap: Record<AdminUsersSortBy, string> = {
  newest: "-createdAt",
  oldest: "createdAt",
  name_asc: "name",
  name_desc: "-name",
};

function tabToRole(tab: AdminUsersTab) {
  if (tab === "job_seekers") return "job_seeker";
  if (tab === "employers") return "employer";
  if (tab === "admins") return "admins";
  return undefined;
}

export default function ManageUsersContent() {
  const queryClient = useQueryClient();
  const { user: firebaseUser } = useAuth();
  const [currentAdminRole, setCurrentAdminRole] = useState<UserRole>();
  const [activeTab, setActiveTab] = useState<AdminUsersTab>("all");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "all">("all");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [sortBy, setSortBy] = useState<AdminUsersSortBy>("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [roleUser, setRoleUser] = useState<AdminUser | null>(null);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadRole() {
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdTokenResult();
      const roleClaim = token.claims.role;

      if (
        mounted &&
        (roleClaim === "admin" || roleClaim === "super_admin")
      ) {
        setCurrentAdminRole(roleClaim);
      }
    }

    void loadRole();
    return () => {
      mounted = false;
    };
  }, [firebaseUser]);

  const filters: AdminListParams = useMemo(() => {
    const tabRole = tabToRole(activeTab);

    return {
      search: search.trim() || undefined,
      role: role !== "all" ? role : tabRole,
      status: status !== "all" ? status : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      limit: 10,
      sortBy: sortMap[sortBy],
    };
  }, [activeTab, dateFrom, dateTo, page, role, search, sortBy, status]);

  const usersQuery = useQuery({
    queryKey: adminQueryKeys.users(filters),
    queryFn: () => getAdminUsers(filters),
  });

  const invalidateAdminUsers = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    await queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
    await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  };

  const roleMutation = useMutation({
    mutationFn: ({ userId, nextRole }: { userId: string; nextRole: UserRole }) =>
      updateUserRole(userId, nextRole),
    onSuccess: async () => {
      setRoleUser(null);
      setFeedbackMessage("User role updated successfully.");
      setActionError("");
      appToast.success("User role updated successfully.");
      await invalidateAdminUsers();
    },
    onError: (error) => {
      const message = getApiErrorMessage(error) || "Unable to change user role.";
      setActionError(message);
      appToast.error(message);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      userId,
      nextStatus,
    }: {
      userId: string;
      nextStatus: UserStatus;
    }) => updateUserStatus(userId, nextStatus),
    onSuccess: async (_data, variables) => {
      setStatusAction(null);
      setFeedbackMessage(
        variables.nextStatus === "active"
          ? "User status updated successfully."
          : "User status updated successfully.",
      );
      setActionError("");
      appToast.success("User status updated successfully.");
      await invalidateAdminUsers();
    },
    onError: (error) => {
      const message = getApiErrorMessage(error) || "Unable to update user.";
      setActionError(message);
      appToast.error(message);
    },
  });

  const blockMutation = useMutation({
    mutationFn: ({ userId, action }: { userId: string; action: "block" | "unblock" }) =>
      action === "block" ? blockUser(userId) : unblockUser(userId),
    onSuccess: async (_data, variables) => {
      setStatusAction(null);
      setFeedbackMessage(
        variables.action === "block"
          ? "User blocked successfully."
          : "User unblocked successfully.",
      );
      setActionError("");
      appToast.success(
        variables.action === "block"
          ? "User blocked successfully."
          : "User unblocked successfully.",
      );
      await invalidateAdminUsers();
    },
    onError: (error, variables) => {
      const message =
        getApiErrorMessage(error) ||
          (variables.action === "block"
            ? "Unable to block user."
            : "Unable to unblock user.");
      setActionError(message);
      appToast.error(message);
    },
  });

  const users = usersQuery.data?.users ?? [];
  const selectedCount = selectedUserIds.length;
  const isMutating =
    roleMutation.isPending || statusMutation.isPending || blockMutation.isPending;

  function resetFilters() {
    setSearch("");
    setRole("all");
    setStatus("all");
    setSortBy("newest");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  function resetPage(run: () => void) {
    setPage(1);
    run();
  }

  function confirmStatusAction() {
    if (!statusAction) return;

    if (statusAction.status === "block" || statusAction.status === "unblock") {
      blockMutation.mutate({
        userId: statusAction.user._id,
        action: statusAction.status,
      });
      return;
    }

    statusMutation.mutate({
      userId: statusAction.user._id,
      nextStatus: statusAction.status,
    });
  }

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin Console</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-muted">
            View, search, filter, and moderate platform accounts.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            disabled
            title="User creation will be enabled when the create-user endpoint is available."
            leftIcon={<UserPlus className="size-4" aria-hidden="true" />}
          >
            Create New User
          </Button>
        </div>
      </div>

      <UsersTabs
        activeTab={activeTab}
        onTabChange={(tab) =>
          resetPage(() => {
            setActiveTab(tab);
            setRole("all");
          })
        }
      />

      <UsersFilterBar
        search={search}
        role={role}
        status={status}
        sortBy={sortBy}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onSearchChange={(value) => resetPage(() => setSearch(value))}
        onRoleChange={(value) => resetPage(() => setRole(value))}
        onStatusChange={(value) => resetPage(() => setStatus(value))}
        onSortChange={(value) => resetPage(() => setSortBy(value))}
        onDateFromChange={(value) => resetPage(() => setDateFrom(value))}
        onDateToChange={(value) => resetPage(() => setDateTo(value))}
        onReset={resetFilters}
      />

      {feedbackMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {feedbackMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {actionError}
        </div>
      ) : null}

      {usersQuery.isError ? (
        <ErrorState
          title="Unable to load users"
          message="Unable to load users. Please try again."
          onRetry={() => usersQuery.refetch()}
        />
      ) : (
        <UsersTable
          users={users}
          meta={usersQuery.data?.meta}
          loading={usersQuery.isLoading}
          selectedUserIds={selectedUserIds}
          currentAdminRole={currentAdminRole}
          currentFirebaseUid={firebaseUser?.uid}
          currentEmail={firebaseUser?.email}
          onPageChange={(nextPage) => {
            setPage(nextPage);
            setSelectedUserIds([]);
          }}
          onSelectionChange={setSelectedUserIds}
          onChangeRole={setRoleUser}
          onChangeStatus={(targetUser, nextStatus) =>
            setStatusAction({ user: targetUser, status: nextStatus })
          }
          onBlockToggle={(targetUser) =>
            setStatusAction({
              user: targetUser,
              status: targetUser.status === "blocked" ? "unblock" : "block",
            })
          }
        />
      )}

      <footer className="rounded-lg border border-slate-200 bg-surface px-4 py-3 text-sm text-muted shadow-sm">
        System status: user moderation endpoints are connected. Bulk actions and
        create-user flows are prepared for backend expansion.
      </footer>

      <BulkUserActionsBar
        selectedCount={selectedCount}
        onClearSelection={() => setSelectedUserIds([])}
      />
      <ChangeUserRoleModal
        key={roleUser?._id ?? "no-role-user"}
        user={roleUser}
        currentAdminRole={currentAdminRole}
        isLoading={roleMutation.isPending}
        onClose={() => setRoleUser(null)}
        onConfirm={(nextRole) => {
          if (!roleUser) return;
          roleMutation.mutate({ userId: roleUser._id, nextRole });
        }}
      />
      <UserStatusConfirmModal
        user={statusAction?.user ?? null}
        status={statusAction?.status ?? null}
        isLoading={isMutating}
        onClose={() => setStatusAction(null)}
        onConfirm={confirmStatusAction}
      />
    </main>
  );
}
