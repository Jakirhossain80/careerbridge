"use client";

import { Bell, BriefcaseBusiness, Shield, UserRound } from "lucide-react";

import SettingsTabs, { type SettingsTabItem } from "@/components/settings/SettingsTabs";

export type JobSeekerSettingsTab =
  | "account"
  | "notifications"
  | "privacy"
  | "job-preferences";

type JobSeekerSettingsTabsProps = {
  activeTab: JobSeekerSettingsTab;
  onTabChange: (tab: JobSeekerSettingsTab) => void;
};

const tabs = [
  { id: "account", label: "Account", icon: UserRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "job-preferences", label: "Job Preferences", icon: BriefcaseBusiness },
] satisfies SettingsTabItem<JobSeekerSettingsTab>[];

export default function JobSeekerSettingsTabs({
  activeTab,
  onTabChange,
}: JobSeekerSettingsTabsProps) {
  return (
    <SettingsTabs
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={onTabChange}
      ariaLabel="Job seeker settings sections"
    />
  );
}
