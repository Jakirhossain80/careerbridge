"use client";

import { Bell, Building2, UsersRound, UserRound } from "lucide-react";

export type SettingsTab = "account" | "notifications" | "company" | "team";

type SettingsTabsProps = {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
};

const tabs = [
  { id: "account", label: "Account", icon: UserRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "company", label: "Company", icon: Building2 },
  { id: "team", label: "Team", icon: UsersRound },
] satisfies Array<{
  id: SettingsTab;
  label: string;
  icon: typeof UserRound;
}>;

export default function SettingsTabs({
  activeTab,
  onTabChange,
}: SettingsTabsProps) {
  return (
    <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-700">
      <div className="flex min-w-max gap-2 px-1" role="tablist" aria-label="Settings sections">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`flex h-12 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:border-slate-300 hover:text-foreground"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="size-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

