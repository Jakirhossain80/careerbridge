"use client";

import Image from "next/image";
import { Bell, LogOut, Menu } from "lucide-react";

import { Button } from "@/components/ui";

type DashboardTopbarProps = {
  title: string;
  userName?: string;
  userEmail?: string;
  avatar?: string;
  showNotificationButton?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || "User";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function DashboardTopbar({
  title,
  userName,
  userEmail,
  avatar,
  showNotificationButton = false,
  notificationCount,
  onNotificationClick,
  onMenuClick,
  onLogout,
  className,
}: DashboardTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-slate-200 bg-surface/95 text-foreground backdrop-blur dark:border-slate-700",
        className,
      )}
    >
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {onMenuClick ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="size-9 p-0 lg:hidden"
              aria-label="Open dashboard menu"
              onClick={onMenuClick}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          ) : null}

          <div className="min-w-0">
            <p className="text-sm text-muted">Dashboard</p>
            <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {showNotificationButton ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="relative size-10 p-0"
              onClick={onNotificationClick}
              aria-label={
                notificationCount
                  ? `${notificationCount} notifications`
                  : "Notifications"
              }
            >
              <Bell className="size-5" aria-hidden="true" />
              {notificationCount ? (
                <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-4 text-white">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              ) : null}
            </Button>
          ) : null}

          {(userName || userEmail || avatar) ? (
            <div className="flex items-center gap-3">
              <div className="hidden min-w-0 text-right sm:block">
                {userName ? (
                  <p className="truncate text-sm font-semibold text-foreground">
                    {userName}
                  </p>
                ) : null}
                {userEmail ? (
                  <p className="truncate text-xs text-muted">{userEmail}</p>
                ) : null}
              </div>

              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-white">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={userName ? `${userName} avatar` : "User avatar"}
                    width={40}
                    height={40}
                    className="size-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true">{getInitials(userName, userEmail)}</span>
                )}
              </div>
            </div>
          ) : null}

          {onLogout ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLogout}
              leftIcon={<LogOut className="size-4" aria-hidden="true" />}
            >
              <span className="hidden sm:inline">Log out</span>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export type { DashboardTopbarProps };
