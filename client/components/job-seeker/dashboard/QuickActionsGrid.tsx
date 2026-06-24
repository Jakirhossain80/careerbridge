"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  FileText,
  Search,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui";

type QuickAction = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const quickActions: QuickAction[] = [
  { label: "Complete Profile", href: "/job-seeker/profile/edit", icon: UserRoundCheck },
  { label: "Upload Resume", href: "/profile/resumes", icon: FileText },
  { label: "Browse Jobs", href: "/jobs", icon: Search },
  { label: "View Saved Jobs", href: "/profile/saved-jobs", icon: Bookmark },
  { label: "View Applied Jobs", href: "/profile/applications", icon: BriefcaseBusiness },
  { label: "Manage Job Alerts", href: "/profile/job-alerts", icon: Bell },
];

export default function QuickActionsGrid() {
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);

  return (
    <Card
      header={
        <div>
          <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
          <p className="mt-1 text-sm text-muted">Shortcuts for common tasks</p>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const selected = selectedQuickAction === action.label;

          return (
            <Link
              key={action.label}
              href={action.href}
              onMouseEnter={() => setSelectedQuickAction(action.label)}
              onFocus={() => setSelectedQuickAction(action.label)}
              className={`flex min-h-16 items-center gap-3 rounded-lg border p-4 text-sm font-semibold transition ${
                selected
                  ? "border-primary bg-blue-50 text-primary"
                  : "border-slate-200 bg-white text-slate-800 hover:border-primary/50 hover:bg-slate-50"
              }`}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              {action.label}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
