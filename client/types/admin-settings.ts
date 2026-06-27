export type AdminSettingsAuditLogItem = {
  user?: string;
  userEmail?: string;
  action: string;
  category: string;
  summary: string;
  createdAt?: string;
};

export type AdminSettingsEnvironment = {
  frameworkVersion: string;
  apiLatencyMs: number;
  lastReboot: string;
  systemHealth: "operational" | "degraded" | "maintenance" | "down" | string;
  environment?: string;
};

export type AdminSystemSettings = {
  general: {
    platformName: string;
    platformTagline?: string;
    platformDescription?: string;
    contactEmail?: string;
    supportEmail?: string;
    contactPhone?: string;
    companyAddress?: string;
  };
  platform: {
    maintenanceMode: boolean;
    publicRegistrationEnabled: boolean;
    employerRegistrationEnabled: boolean;
    jobPostingEnabled: boolean;
    blogModuleEnabled: boolean;
  };
  authentication: {
    emailLoginEnabled: boolean;
    googleLoginEnabled: boolean;
    passwordResetEnabled: boolean;
    emailVerificationRequired: boolean;
  };
  registration: {
    autoApproveJobSeekers: boolean;
    requireProfileCompletion: boolean;
    resumeUploadRequirement: boolean;
  };
  employerApproval: {
    employerVerificationRequired: boolean;
    manualEmployerApproval: boolean;
    companyVerificationRequired: boolean;
  };
  jobApproval: {
    manualJobApproval: boolean;
    autoPublishJobs: boolean;
    featuredJobRequirements: boolean;
  };
  blog: {
    blogPublishingEnabled: boolean;
    commentingEnabled: boolean;
    featuredBlogsEnabled: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    applicationNotifications: boolean;
    interviewNotifications: boolean;
    adminNotifications: boolean;
  };
  email: {
    senderName: string;
    senderEmail?: string;
    replyToEmail?: string;
  };
  security: {
    sessionTimeoutMinutes: number;
    loginAttemptLimit: number;
    minimumPasswordLength: number;
    requirePasswordUppercase: boolean;
    requirePasswordNumber: boolean;
    requirePasswordSymbol: boolean;
    twoFactorRequired: boolean;
  };
  seo: {
    defaultSeoTitle: string;
    defaultSeoDescription?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    openGraphImage?: string;
  };
  analytics: {
    analyticsEnabled: boolean;
    trackingEnabled: boolean;
    anonymizeIp: boolean;
    reportingEnabled: boolean;
  };
  auditLog?: AdminSettingsAuditLogItem[];
  environment?: AdminSettingsEnvironment;
  updatedAt?: string;
};

export type AdminSystemSettingsPayload = Omit<
  AdminSystemSettings,
  "auditLog" | "environment" | "updatedAt"
>;
