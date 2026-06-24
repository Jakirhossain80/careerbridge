"use client";

import Link from "next/link";
import { KeyRound, ShieldCheck, TimerReset } from "lucide-react";

import SettingsCard from "@/components/settings/SettingsCard";
import { Badge, Button } from "@/components/ui";

const securityItems = [
  {
    title: "Change password",
    description: "Use the authentication password flow when you need to update credentials.",
    action: "Change Password",
    href: "/reset-password",
    icon: KeyRound,
    enabled: true,
  },
  {
    title: "Login security",
    description: "Prepared for device and session controls when backend audit logs are available.",
    action: "View Activity",
    icon: TimerReset,
    enabled: false,
  },
  {
    title: "Two-factor authentication",
    description: "Prepared for future 2FA controls when the auth module exposes support.",
    action: "Configure 2FA",
    icon: ShieldCheck,
    enabled: false,
  },
];

export default function SecuritySettingsCard() {
  return (
    <SettingsCard
      title="Security Settings"
      description="Review safe account security actions and prepared authentication placeholders."
      icon={<ShieldCheck className="size-5" aria-hidden="true" />}
      contentClassName="divide-y divide-slate-200 p-0 dark:divide-slate-700"
    >
      {securityItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-primary dark:bg-blue-950/40">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  {!item.enabled ? <Badge variant="warning">Placeholder</Badge> : null}
                </div>
                <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
              </div>
            </div>
            {item.href ? (
              <Link href={item.href}>
                <Button type="button" variant="outline" size="sm">
                  {item.action}
                </Button>
              </Link>
            ) : (
              <Button type="button" variant="outline" size="sm" disabled>
                {item.action}
              </Button>
            )}
          </div>
        );
      })}
    </SettingsCard>
  );
}
