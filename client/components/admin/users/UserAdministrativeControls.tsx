import { Ban, CheckCircle2, Eye, Pencil, Shield, UserCog, UserX } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { AdminUser, UserRole, UserStatus } from "@/types/admin-user.types";

type UserAdministrativeControlsProps = {
  user: AdminUser;
  currentAdminRole?: UserRole;
  currentFirebaseUid?: string;
  currentEmail?: string | null;
  isMutating?: boolean;
  onEdit: () => void;
  onChangeRole: () => void;
  onChangeStatus: (status: UserStatus) => void;
  onBlockToggle: () => void;
};

function isSelf(
  user: AdminUser,
  currentFirebaseUid?: string,
  currentEmail?: string | null,
) {
  return (
    Boolean(currentFirebaseUid && user.firebaseUid === currentFirebaseUid) ||
    Boolean(currentEmail && user.email.toLowerCase() === currentEmail.toLowerCase())
  );
}

export default function UserAdministrativeControls({
  user,
  currentAdminRole,
  currentFirebaseUid,
  currentEmail,
  isMutating = false,
  onEdit,
  onChangeRole,
  onChangeStatus,
  onBlockToggle,
}: UserAdministrativeControlsProps) {
  const self = isSelf(user, currentFirebaseUid, currentEmail);
  const isTargetSuperAdmin = user.role === "super_admin";
  const canModerate =
    !self && (currentAdminRole === "super_admin" || !isTargetSuperAdmin);
  const canManageRole =
    !self &&
    (currentAdminRole === "super_admin" ||
      (user.role !== "admin" && user.role !== "super_admin"));

  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Administrative Controls
          </h2>
          <p className="mt-1 text-sm text-muted">
            Manage role, account status, and moderation actions.
          </p>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          leftIcon={<Pencil className="size-4" aria-hidden="true" />}
        >
          Edit User Information
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canManageRole || isMutating}
          onClick={onChangeRole}
          leftIcon={<UserCog className="size-4" aria-hidden="true" />}
        >
          Change User Role
        </Button>
        {user.status !== "active" ? (
          <Button
            type="button"
            variant="outline"
            disabled={!canModerate || isMutating}
            onClick={() => onChangeStatus("active")}
            leftIcon={<CheckCircle2 className="size-4" aria-hidden="true" />}
          >
            Activate User
          </Button>
        ) : null}
        {user.status !== "suspended" ? (
          <Button
            type="button"
            variant="outline"
            disabled={!canModerate || isMutating}
            onClick={() => onChangeStatus("suspended")}
            leftIcon={<Ban className="size-4" aria-hidden="true" />}
          >
            Suspend User
          </Button>
        ) : null}
        <Button
          type="button"
          variant={user.status === "blocked" ? "outline" : "danger"}
          disabled={!canModerate || isMutating}
          onClick={onBlockToggle}
          leftIcon={
            user.status === "blocked" ? (
              <Shield className="size-4" aria-hidden="true" />
            ) : (
              <UserX className="size-4" aria-hidden="true" />
            )
          }
        >
          {user.status === "blocked" ? "Unblock User" : "Block User"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled
          title="Related activity drill-down will be enabled when a dedicated activity route is available."
          leftIcon={<Eye className="size-4" aria-hidden="true" />}
        >
          View Related Activity
        </Button>
      </div>
      {self || isTargetSuperAdmin ? (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Sensitive actions are limited by account ownership and super admin
          protection rules.
        </p>
      ) : null}
    </Card>
  );
}
