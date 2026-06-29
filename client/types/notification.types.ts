export type NotificationType =
  | "application_submitted"
  | "application_status_changed"
  | "interview_scheduled"
  | "employer_approved"
  | "job_approved"
  | "job_rejected"
  | "new_job_alert"
  | "application_update"
  | "interview_invitation"
  | "interview_reminder"
  | "job_alert"
  | "recommended_job"
  | "saved_job_update"
  | "employer_message"
  | "system"
  | "security"
  | "career_insight";

export type NotificationResourceType =
  | "application"
  | "employer"
  | "job"
  | "interview"
  | "job_alert"
  | "recommended_job"
  | "saved_job"
  | "message"
  | "system";

export type NotificationStatusFilter = "all" | "read" | "unread";
export type NotificationSortBy = "newest" | "oldest";

export interface CareerBridgeNotification {
  _id: string;
  userId?: string;
  recipientId?: string;
  recipientRole?: string;
  actorId?: string;
  type: NotificationType;
  title: string;
  message: string;
  read?: boolean;
  isRead: boolean;
  entityType?: NotificationResourceType;
  entityId?: string;
  link?: string;
  metadata?: Record<string, unknown>;
  resourceType?: NotificationResourceType;
  resourceId?: string;
  resourceSlug?: string;
  actionLabel?: string;
  createdAt: string;
  updatedAt?: string;
}

export type NotificationsQueryParams = {
  search?: string;
  status?: NotificationStatusFilter;
  type?: NotificationType | "all";
  sortBy?: NotificationSortBy;
  page?: number;
  limit?: number;
};

export interface NotificationsResponse {
  notifications: CareerBridgeNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}
