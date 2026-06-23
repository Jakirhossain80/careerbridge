"use client";

import { KeyRound, ShieldCheck, TimerReset } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";

const securityItems = [
  {
    title: "Change password",
    description: "Password changes are handled through the connected authentication provider.",
    action: "Manage Password",
    icon: KeyRound,
  },
  {
    title: "Two-factor authentication",
    description: "Prepared for future 2FA controls when the auth module exposes support.",
    action: "Configure 2FA",
    icon: ShieldCheck,
  },
  {
    title: "Login activity",
    description: "Review recent sessions and device access once audit logs are available.",
    action: "View Activity",
    icon: TimerReset,
  },
];

export default function SecuritySettingsCard() {
  return (
    <Card
      header={
        <div>
          <h2 className="text-lg font-semibold">Security Settings</h2>
          <p className="mt-1 text-sm text-muted">
            Safe placeholders for authentication workflows that require backend support.
          </p>
        </div>
      }
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
                  <Badge variant="warning">Placeholder</Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" disabled>
              {item.action}
            </Button>
          </div>
        );
      })}
    </Card>
  );
}

