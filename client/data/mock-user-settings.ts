import type { UserSettings } from "@/types/user-settings.types";

export const mockUserSettings: UserSettings = {
  _id: "settings-job-seeker-1",
  userId: "job-seeker-1",
  accountPreferences: {
    currentEmail: "tanjim.ahmed@example.com",
    newEmail: "",
    phone: "+880 1712 000 456",
    linkedProfiles: [
      {
        provider: "Google",
        email: "tanjim.ahmed@example.com",
      },
    ],
    language: "en",
    timeZone: "Asia/Dhaka",
  },
  notificationPreferences: {
    enableNotifications: true,
    emailNotifications: true,
    applicationUpdates: true,
    interviewNotifications: true,
    interviewReminders: true,
    jobAlerts: true,
    recommendedJobs: true,
  },
  privacySettings: {
    profileVisibility: "recruiters_only",
    resumeVisibility: "recruiters_only",
    contactInfoVisible: true,
    publicSearchVisible: true,
  },
  jobPreferences: {
    preferredCategories: ["Software Engineering", "Product Management"],
    preferredLocations: ["Dhaka", "Remote"],
    preferredEmploymentTypes: ["Full-time", "Contract"],
    preferredWorkModes: ["Remote", "Hybrid"],
    expectedSalaryMin: 80000,
    expectedSalaryMax: 150000,
  },
  updatedAt: "2026-06-24T00:00:00.000Z",
};
