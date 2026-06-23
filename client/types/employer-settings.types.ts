export interface EmployerAccountSettings {
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  designation?: string;
}

export interface EmployerCompanySettings {
  companyId: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  website?: string;
  location?: string;
  industry?: string;
  companySize?: string;
}

export interface EmployerNotificationSettings {
  newApplicant: boolean;
  interviewReminder: boolean;
  jobExpiry: boolean;
  emailNotifications: boolean;
  dailyDigest: boolean;
}

export interface EmployerPrivacySettings {
  companyProfileVisible: boolean;
  jobPostingVisible: boolean;
  contactInfoVisible: boolean;
  showCompanySize: boolean;
  showSalaryRange: boolean;
}

export interface EmployerTeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Recruiter" | "Viewer";
  status: "Active" | "Invited";
}

export interface EmployerSettings {
  account: EmployerAccountSettings;
  company: EmployerCompanySettings;
  notifications: EmployerNotificationSettings;
  privacy: EmployerPrivacySettings;
  team: EmployerTeamMember[];
}

export type EmployerSettingsPayload = EmployerSettings;

