"use client";

import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { getRoleLabel } from "@/lib/role-labels";
import type { AdminUser, UserRole } from "@/types/admin-user.types";

type ChangeUserRoleModalProps = {
  user: AdminUser | null;
  currentAdminRole?: UserRole;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (role: UserRole) => void;
};

const baseAssignableRoles = ["job_seeker", "employer"] as const satisfies readonly UserRole[];
const superAdminAssignableRoles = [
  ...baseAssignableRoles,
  "admin",
] as const satisfies readonly UserRole[];

function toRoleOptions(roles: readonly UserRole[]) {
  return roles.map((value) => ({
    label: getRoleLabel(value),
    value,
  }));
}

export default function ChangeUserRoleModal({
  user,
  currentAdminRole,
  isLoading = false,
  onClose,
  onConfirm,
}: ChangeUserRoleModalProps) {
  const [role, setRole] = useState<UserRole>(user?.role ?? "job_seeker");
  const roleOptions = useMemo(
    () =>
      currentAdminRole === "super_admin"
        ? toRoleOptions(superAdminAssignableRoles)
        : toRoleOptions(baseAssignableRoles),
    [currentAdminRole],
  );

  const selectedRoleAllowed = roleOptions.some((option) => option.value === role);

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      title="Change user role"
      description={
        user
          ? `Select a new platform role for ${user.name}.`
          : "Select a new platform role."
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(role)}
            isLoading={isLoading}
            disabled={!user || !selectedRoleAllowed || role === user.role}
          >
            Change role
          </Button>
        </>
      }
    >
      <Select
        label="Role"
        value={role}
        onChange={(event) => setRole(event.target.value as UserRole)}
        helperText={
          currentAdminRole === "super_admin"
            ? "Super admins can assign admin roles."
            : "Admins can only switch users between job seeker and employer roles."
        }
      >
        {roleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Modal>
  );
}
