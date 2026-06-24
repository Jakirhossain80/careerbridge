import {
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  Lightbulb,
  LockKeyhole,
  Mail,
  Megaphone,
  Sparkles,
  Star,
} from "lucide-react";

import type { NotificationType } from "@/types/notification.types";

type NotificationTypeIconProps = {
  type: NotificationType;
};

const iconMap = {
  application_update: BriefcaseBusiness,
  interview_invitation: CalendarClock,
  interview_reminder: CalendarClock,
  job_alert: Bell,
  recommended_job: Sparkles,
  saved_job_update: Star,
  employer_message: Mail,
  system: Megaphone,
  security: LockKeyhole,
  career_insight: Lightbulb,
} satisfies Record<NotificationType, typeof Bell>;

export default function NotificationTypeIcon({ type }: NotificationTypeIconProps) {
  const Icon = iconMap[type];

  return <Icon className="size-5" aria-hidden="true" />;
}
