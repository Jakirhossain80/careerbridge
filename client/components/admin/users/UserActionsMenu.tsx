"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import Button from "@/components/ui/Button";
import type { AdminUser, UserRole, UserStatus } from "@/types/admin-user.types";

type UserActionsMenuProps = {
  user: AdminUser;
  currentAdminRole?: UserRole;
  currentFirebaseUid?: string;
  currentEmail?: string | null;
  onChangeRole: (user: AdminUser) => void;
  onChangeStatus: (user: AdminUser, status: UserStatus) => void;
  onBlockToggle: (user: AdminUser) => void;
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

export default function UserActionsMenu({
  user,
  currentAdminRole,
  currentFirebaseUid,
  currentEmail,
  onChangeRole,
  onChangeStatus,
  onBlockToggle,
}: UserActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const self = isSelf(user, currentFirebaseUid, currentEmail);
  const isTargetSuperAdmin = user.role === "super_admin";
  const canModerate =
    !self && (currentAdminRole === "super_admin" || !isTargetSuperAdmin);
  const canManageRole =
    currentAdminRole === "super_admin" || (user.role !== "admin" && user.role !== "super_admin");

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative inline-flex justify-end">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="size-9 p-0"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Open actions for ${user.name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-10 z-20 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-950/10"
        >
          <Link
            role="menuitem"
            href={`/admin/users/${user._id}`}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            View User Details
          </Link>
          <Link
            role="menuitem"
            href={`/admin/users/${user._id}`}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Edit User Information
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={!canManageRole || self}
            className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
            onClick={() => {
              setOpen(false);
              onChangeRole(user);
            }}
          >
            Change User Role
          </button>
          {user.status !== "active" ? (
            <button
              type="button"
              role="menuitem"
              disabled={!canModerate}
              className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
              onClick={() => {
                setOpen(false);
                onChangeStatus(user, "active");
              }}
            >
              Activate User
            </button>
          ) : null}
          {user.status !== "pending" ? (
            <button
              type="button"
              role="menuitem"
              disabled={!canModerate}
              className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
              onClick={() => {
                setOpen(false);
                onChangeStatus(user, "pending");
              }}
            >
              Mark Pending
            </button>
          ) : null}
          {user.status !== "suspended" ? (
            <button
              type="button"
              role="menuitem"
              disabled={!canModerate}
              className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
              onClick={() => {
                setOpen(false);
                onChangeStatus(user, "suspended");
              }}
            >
              Suspend User
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            disabled={!canModerate}
            className="block w-full px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-400"
            onClick={() => {
              setOpen(false);
              onBlockToggle(user);
            }}
          >
            {user.status === "blocked" ? "Unblock User" : "Block User"}
          </button>
          <button
            type="button"
            role="menuitem"
            disabled
            title="Activity details will be enabled when the activity route is available."
            className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-400 disabled:cursor-not-allowed"
          >
            View Related Activity
          </button>
        </div>
      ) : null}
    </div>
  );
}
