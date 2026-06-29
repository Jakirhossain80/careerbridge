"use client";

import { RotateCcw } from "lucide-react";

import { Button, Card, SearchBar, Select } from "@/components/ui";
import type {
  NotificationSortBy,
  NotificationStatusFilter,
  NotificationType,
} from "@/types/notification.types";

type NotificationFiltersProps = {
  search: string;
  status: NotificationStatusFilter;
  type: NotificationType | "all";
  sortBy: NotificationSortBy;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  onStatusChange: (value: NotificationStatusFilter) => void;
  onTypeChange: (value: NotificationType | "all") => void;
  onSortChange: (value: NotificationSortBy) => void;
  onReset: () => void;
};

const typeOptions: Array<{ label: string; value: NotificationType | "all" }> = [
  { label: "All Types", value: "all" },
  { label: "Application Submitted", value: "application_submitted" },
  { label: "Application Status Changed", value: "application_status_changed" },
  { label: "Interview Scheduled", value: "interview_scheduled" },
  { label: "Employer Approved", value: "employer_approved" },
  { label: "Job Approved", value: "job_approved" },
  { label: "Job Rejected", value: "job_rejected" },
  { label: "New Job Alert", value: "new_job_alert" },
  { label: "Application Update", value: "application_update" },
  { label: "Interview Invitation", value: "interview_invitation" },
  { label: "Interview Reminder", value: "interview_reminder" },
  { label: "Job Alert", value: "job_alert" },
  { label: "Recommended Job", value: "recommended_job" },
  { label: "Saved Job Update", value: "saved_job_update" },
  { label: "Employer Message", value: "employer_message" },
  { label: "System Notification", value: "system" },
  { label: "Security Alert", value: "security" },
  { label: "Career Insight", value: "career_insight" },
];

export default function NotificationFilters({
  search,
  status,
  type,
  sortBy,
  onSearchChange,
  onSearchSubmit,
  onStatusChange,
  onTypeChange,
  onSortChange,
  onReset,
}: NotificationFiltersProps) {
  return (
    <Card contentClassName="p-4 sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(260px,1fr)_160px_220px_160px_auto] xl:items-end">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          placeholder="Search title or message"
          label="Search notifications"
        />

        <Select
          label="Status"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as NotificationStatusFilter)
          }
          options={[
            { label: "All", value: "all" },
            { label: "Unread", value: "unread" },
            { label: "Read", value: "read" },
          ]}
        />

        <Select
          label="Type"
          value={type}
          onChange={(event) => onTypeChange(event.target.value as NotificationType | "all")}
          options={typeOptions}
        />

        <Select
          label="Sort"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as NotificationSortBy)}
          options={[
            { label: "Newest First", value: "newest" },
            { label: "Oldest First", value: "oldest" },
          ]}
        />

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          leftIcon={<RotateCcw className="size-4" aria-hidden="true" />}
        >
          Reset
        </Button>
      </div>
    </Card>
  );
}
