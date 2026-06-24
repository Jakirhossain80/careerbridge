export type ProfileVisibility = "public" | "recruiters_only" | "private";

export interface LinkedProfile {
  provider: string;
  email?: string;
}

export interface AccountPreferences {
  currentEmail?: string;
  newEmail?: string;
  phone?: string;
  linkedProfiles?: LinkedProfile[];
  language?: string;
  timeZone?: string;
}

export interface NotificationPreferences {
  enableNotifications: boolean;
  emailNotifications: boolean;
  applicationUpdates: boolean;
  interviewNotifications: boolean;
  interviewReminders: boolean;
  jobAlerts: boolean;
  recommendedJobs: boolean;
}

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  resumeVisibility: ProfileVisibility;
  contactInfoVisible: boolean;
  publicSearchVisible: boolean;
}

export interface JobPreferences {
  preferredCategories?: string[];
  preferredLocations?: string[];
  preferredEmploymentTypes?: string[];
  preferredWorkModes?: string[];
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
}

export interface UserSettings {
  _id?: string;
  userId?: string;
  accountPreferences: AccountPreferences;
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
  jobPreferences?: JobPreferences;
  updatedAt?: string;
}

export type UserSettingsPayload = UserSettings;
