"use client";

import type { ComponentType, SVGProps } from "react";

export type SettingsTabItem<T extends string> = {
  id: T;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

type SettingsTabsProps<T extends string> = {
  activeTab: T;
  tabs: SettingsTabItem<T>[];
  onTabChange: (tab: T) => void;
  ariaLabel?: string;
};

export default function SettingsTabs<T extends string>({
  activeTab,
  tabs,
  onTabChange,
  ariaLabel = "Settings sections",
}: SettingsTabsProps<T>) {
  return (
    <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-700">
      <div className="flex min-w-max gap-2 px-1" role="tablist" aria-label={ariaLabel}>
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
              {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { SettingsTabsProps };
