import type { AuthUserRole } from "@/services/auth.service";

const roleLabels: Record<AuthUserRole, string> = {
  job_seeker: "Job Seeker",
  employer: "Employer",
  admin: "Admin",
  super_admin: "Super Admin",
};

export function getRoleLabel(role?: AuthUserRole | string) {
  if (!role) return "Admin";

  return role in roleLabels
    ? roleLabels[role as AuthUserRole]
    : role.replace(/_/g, " ");
}

export function getSidebarRoleLabel(role?: AuthUserRole | string) {
  return getRoleLabel(role).toUpperCase();
}
