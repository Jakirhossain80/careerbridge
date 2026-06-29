export type DashboardRole =
  | "job_seeker"
  | "employer"
  | "admin"
  | "super_admin"
  | "recruiter"
  | "moderator";

const dashboardPaths: Record<DashboardRole, string> = {
  job_seeker: "/job-seeker/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
  super_admin: "/admin/dashboard",
  recruiter: "/employer/dashboard",
  moderator: "/admin/dashboard",
};

export const getDashboardPathForRole = (role?: DashboardRole | null) => {
  if (!role) {
    return null;
  }

  return dashboardPaths[role] ?? null;
};

const profilePaths: Partial<Record<DashboardRole, string>> = {
  job_seeker: "/job-seeker/profile",
  employer: "/employer/dashboard/company-profile",
  recruiter: "/employer/dashboard/company-profile",
};

export const getProfilePathForRole = (role?: DashboardRole | null) => {
  if (!role) {
    return null;
  }

  return profilePaths[role] ?? null;
};

const settingsPaths: Record<DashboardRole, string> = {
  job_seeker: "/job-seeker/settings",
  employer: "/employer/settings",
  admin: "/admin/settings",
  super_admin: "/admin/settings",
  recruiter: "/employer/settings",
  moderator: "/admin/settings",
};

export const getSettingsPathForRole = (role?: DashboardRole | null) => {
  if (!role) {
    return null;
  }

  return settingsPaths[role] ?? null;
};
