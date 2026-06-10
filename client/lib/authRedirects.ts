export type DashboardRole = "job_seeker" | "employer" | "admin" | "hr_member";

const dashboardPaths: Record<DashboardRole, string> = {
  job_seeker: "/dashboard/job-seeker",
  employer: "/dashboard/employer",
  admin: "/dashboard/admin",
  hr_member: "/dashboard/hr-member",
};

export const getDashboardPathForRole = (role?: DashboardRole | null) => {
  if (!role) {
    return "/dashboard";
  }

  return dashboardPaths[role] ?? "/dashboard";
};
