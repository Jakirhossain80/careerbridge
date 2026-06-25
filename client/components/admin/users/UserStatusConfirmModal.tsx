"use client";

import ConfirmActionModal from "@/components/admin/ConfirmActionModal";
import type { AdminUser, UserStatus } from "@/types/admin-user.types";

type UserStatusConfirmModalProps = {
  user: AdminUser | null;
  status: UserStatus | "block" | "unblock" | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const actionCopy: Record<
  UserStatus | "block" | "unblock",
  { title: string; confirmLabel: string; destructive?: boolean; verb: string }
> = {
  active: {
    title: "Activate user",
    confirmLabel: "Activate",
    verb: "activate",
  },
  pending: {
    title: "Mark user pending",
    confirmLabel: "Mark pending",
    verb: "mark pending",
  },
  suspended: {
    title: "Suspend user",
    confirmLabel: "Suspend",
    destructive: true,
    verb: "suspend",
  },
  blocked: {
    title: "Block user",
    confirmLabel: "Block",
    destructive: true,
    verb: "block",
  },
  block: {
    title: "Block user",
    confirmLabel: "Block",
    destructive: true,
    verb: "block",
  },
  unblock: {
    title: "Unblock user",
    confirmLabel: "Unblock",
    verb: "unblock",
  },
};

export default function UserStatusConfirmModal({
  user,
  status,
  isLoading = false,
  onClose,
  onConfirm,
}: UserStatusConfirmModalProps) {
  const copy = status ? actionCopy[status] : null;

  return (
    <ConfirmActionModal
      open={Boolean(user && copy)}
      title={copy?.title ?? ""}
      description={
        user && copy
          ? `This will ${copy.verb} ${user.name} (${user.email}).`
          : ""
      }
      confirmLabel={copy?.confirmLabel}
      destructive={copy?.destructive}
      isLoading={isLoading}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
