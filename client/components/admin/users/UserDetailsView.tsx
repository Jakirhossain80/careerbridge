"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Pencil } from "lucide-react";

import ChangeUserRoleModal from "@/components/admin/users/ChangeUserRoleModal";
import EditUserModal from "@/components/admin/users/EditUserModal";
import UserActivityTable from "@/components/admin/users/UserActivityTable";
import UserAdministrativeControls from "@/components/admin/users/UserAdministrativeControls";
import UserProfileInformation from "@/components/admin/users/UserProfileInformation";
import UserStatsGrid from "@/components/admin/users/UserStatsGrid";
import UserStatusConfirmModal from "@/components/admin/users/UserStatusConfirmModal";
import UserSummaryCard from "@/components/admin/users/UserSummaryCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useAdminUser,
  useAdminUserMutations,
} from "@/hooks/admin/useAdminUser";
import { getApiErrorMessage } from "@/lib/api";
import type { AdminUserUpdateFormValues } from "@/lib/validations/admin-user.schema";
import type { AdminUser, UserRole, UserStatus } from "@/types/admin-user.types";

type UserDetailsViewProps = {
  userId: string;
};

type PendingStatusAction = {
  user: AdminUser;
  status: UserStatus | "block" | "unblock";
} | null;

function UserDetailsLoading() {
  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6">
      <LoadingSkeleton variant="card" className="h-52" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} variant="card" />
        ))}
      </div>
      <LoadingSkeleton variant="card" className="h-64" />
    </main>
  );
}

function isCurrentUser(
  user: AdminUser,
  currentFirebaseUid?: string,
  currentEmail?: string | null,
) {
  return (
    Boolean(currentFirebaseUid && user.firebaseUid === currentFirebaseUid) ||
    Boolean(currentEmail && user.email.toLowerCase() === currentEmail.toLowerCase())
  );
}

export default function UserDetailsView({ userId }: UserDetailsViewProps) {
  const { user: firebaseUser, profile } = useAuth();
  const [currentAdminRole, setCurrentAdminRole] = useState<UserRole>();
  const [roleUser, setRoleUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [statusAction, setStatusAction] = useState<PendingStatusAction>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const userQuery = useAdminUser(userId);
  const { updateMutation, roleMutation, statusMutation, blockMutation } =
    useAdminUserMutations(userId);

  useEffect(() => {
    let mounted = true;

    async function loadRole() {
      if (profile?.role === "admin" || profile?.role === "super_admin") {
        setCurrentAdminRole(profile.role);
        return;
      }

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
  }, [firebaseUser, profile?.role]);

  if (userQuery.isLoading) {
    return <UserDetailsLoading />;
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <main className="p-4 sm:p-6">
        <ErrorState
          title="Unable to load user"
          message="This user record could not be loaded. Please retry or return to Manage Users."
          onRetry={() => userQuery.refetch()}
        />
      </main>
    );
  }

  const user = userQuery.data;
  const isAdminLevelUser = user.role === "admin" || user.role === "super_admin";
  const canEditUserInfo =
    isCurrentUser(user, firebaseUser?.uid, firebaseUser?.email) ||
    currentAdminRole === "super_admin" ||
    !isAdminLevelUser;
  const isMutating =
    updateMutation.isPending ||
    roleMutation.isPending ||
    statusMutation.isPending ||
    blockMutation.isPending;

  function clearMessages() {
    setFeedbackMessage("");
    setActionError("");
  }

  function confirmStatusAction() {
    if (!statusAction) return;
    clearMessages();

    if (statusAction.status === "block" || statusAction.status === "unblock") {
      blockMutation.mutate(statusAction.status, {
        onSuccess: () => {
          setStatusAction(null);
          setFeedbackMessage(
            statusAction.status === "block"
              ? "User blocked successfully."
              : "User unblocked successfully.",
          );
        },
        onError: (error) => {
          setActionError(getApiErrorMessage(error));
        },
      });
      return;
    }

    statusMutation.mutate(statusAction.status, {
      onSuccess: () => {
        setStatusAction(null);
        setFeedbackMessage("User status updated successfully.");
      },
      onError: (error) => {
        setActionError(getApiErrorMessage(error));
      },
    });
  }

  function handleEdit(values: AdminUserUpdateFormValues) {
    clearMessages();
    updateMutation.mutate(
      {
        name: values.name,
        photoURL: values.photoURL || undefined,
        profileCompleted: values.profileCompleted,
      },
      {
        onSuccess: () => {
          setEditUser(null);
          setFeedbackMessage("User information updated successfully.");
        },
        onError: (error) => {
          setActionError(getApiErrorMessage(error));
        },
      },
    );
  }

  return (
    <main className="space-y-5 p-4 pb-24 sm:p-6 sm:pb-24">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Manage Users
          </Link>
          <p className="mt-3 text-sm font-medium text-primary">Admin Console</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            User Details
          </h1>
          <p className="mt-1 text-sm text-muted">
            Review account data, profile information, activity, and moderation controls.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <a href={`mailto:${user.email}`} className="inline-flex">
            <Button
              type="button"
              variant="outline"
              leftIcon={<Mail className="size-4" aria-hidden="true" />}
            >
              Contact User
            </Button>
          </a>
          <Button
            type="button"
            disabled={!canEditUserInfo}
            onClick={() => setEditUser(user)}
            leftIcon={<Pencil className="size-4" aria-hidden="true" />}
          >
            Edit User
          </Button>
        </div>
      </div>

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

      <UserSummaryCard user={user} />

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Account Statistics</h2>
          <p className="mt-1 text-sm text-muted">
            Metrics are shown when supplied by the admin user details API.
          </p>
        </div>
        <UserStatsGrid stats={user.stats} />
      </section>

      <UserProfileInformation user={user} />

      <Card
        header={
          <div>
            <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
            <p className="mt-1 text-sm text-muted">
              Recent logins, applications, job postings, interviews, and account events.
            </p>
          </div>
        }
      >
        <UserActivityTable activity={user.recentActivity} />
      </Card>

      <UserAdministrativeControls
        user={user}
        currentAdminRole={currentAdminRole}
        currentFirebaseUid={firebaseUser?.uid}
        currentEmail={firebaseUser?.email}
        isMutating={isMutating}
        onEdit={() => setEditUser(user)}
        onChangeRole={() => setRoleUser(user)}
        onChangeStatus={(status) => setStatusAction({ user, status })}
        onBlockToggle={() =>
          setStatusAction({
            user,
            status: user.status === "blocked" ? "unblock" : "block",
          })
        }
      />

      <EditUserModal
        user={editUser}
        isLoading={updateMutation.isPending}
        onClose={() => setEditUser(null)}
        onSubmit={handleEdit}
      />
      <ChangeUserRoleModal
        key={roleUser?._id ?? "no-role-user"}
        user={roleUser}
        currentAdminRole={currentAdminRole}
        isLoading={roleMutation.isPending}
        onClose={() => setRoleUser(null)}
        onConfirm={(nextRole) => {
          clearMessages();
          roleMutation.mutate(nextRole, {
            onSuccess: () => {
              setRoleUser(null);
              setFeedbackMessage("User role updated successfully.");
            },
            onError: (error) => {
              setActionError(getApiErrorMessage(error));
            },
          });
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
