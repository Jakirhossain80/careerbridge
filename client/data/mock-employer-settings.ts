import type { EmployerSettings } from "@/types/employer-settings.types";

export const mockEmployerSettings: EmployerSettings = {
  account: {
    fullName: "Ayesha Rahman",
    email: "ayesha@brightpath.io",
    phone: "+880 1712 345 678",
    avatar: "",
    designation: "Talent Acquisition Lead",
  },
  company: {
    companyId: "company-brightpath",
    companyName: "BrightPath Technologies",
    companyEmail: "careers@brightpath.io",
    companyPhone: "+880 9612 345 678",
    website: "https://brightpath.io",
    location: "Dhaka, Bangladesh",
    industry: "Software and IT Services",
    companySize: "51-200",
  },
  notifications: {
    newApplicant: true,
    interviewReminder: true,
    jobExpiry: true,
    emailNotifications: true,
    dailyDigest: false,
  },
  privacy: {
    companyProfileVisible: true,
    jobPostingVisible: true,
    contactInfoVisible: true,
    showCompanySize: true,
    showSalaryRange: true,
  },
  team: [
    {
      id: "team-1",
      name: "Ayesha Rahman",
      email: "ayesha@brightpath.io",
      role: "Owner",
      status: "Active",
    },
    {
      id: "team-2",
      name: "Nabil Ahmed",
      email: "nabil@brightpath.io",
      role: "Recruiter",
      status: "Active",
    },
    {
      id: "team-3",
      name: "Sara Islam",
      email: "sara@brightpath.io",
      role: "Viewer",
      status: "Invited",
    },
  ],
};

