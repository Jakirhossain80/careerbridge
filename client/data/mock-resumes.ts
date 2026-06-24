import type { ResumeManagerData } from "@/types/resume.types";

export const mockResumeManagerData: ResumeManagerData = {
  resumes: [
    {
      _id: "resume-001",
      jobSeekerId: "profile-001",
      fileName: "Ayesha_Rahman_Resume.pdf",
      fileUrl: "/resumes/ayesha-rahman-resume.pdf",
      fileType: "pdf",
      mimeType: "application/pdf",
      fileSize: 824_000,
      status: "active",
      isDefault: true,
      uploadedAt: "2026-05-18T10:15:00.000Z",
      updatedAt: "2026-05-18T10:15:00.000Z",
      version: 3,
    },
    {
      _id: "resume-000",
      jobSeekerId: "profile-001",
      fileName: "Ayesha_Rahman_Frontend_CV.pdf",
      fileUrl: "/resumes/ayesha-rahman-frontend-cv.pdf",
      fileType: "pdf",
      mimeType: "application/pdf",
      fileSize: 768_000,
      status: "uploaded",
      isDefault: false,
      uploadedAt: "2026-04-11T09:20:00.000Z",
      updatedAt: "2026-04-11T09:20:00.000Z",
      version: 2,
    },
  ],
  performance: {
    score: 86,
    label: "Strong",
    summary:
      "Your resume is ready for quick apply workflows. Add more measurable achievements to improve recruiter scan quality.",
  },
  insights: [
    {
      title: "Add measurable outcomes",
      description:
        "Use numbers for impact, such as page speed gains, conversion lift, or dashboard adoption.",
      tone: "primary",
    },
    {
      title: "Keep a role-focused version",
      description:
        "Maintain one active resume for frontend roles and another for full-stack applications.",
      tone: "secondary",
    },
    {
      title: "Refresh after major projects",
      description:
        "Update your resume when a new shipped project changes your strongest evidence.",
      tone: "tertiary",
    },
  ],
  profileCompletion: 86,
  resumeCompletionStatus: "Resume uploaded",
  lastResumeUpdate: "2026-05-18T10:15:00.000Z",
};

mockResumeManagerData.activeResume = mockResumeManagerData.resumes[0];
mockResumeManagerData.versionHistory = mockResumeManagerData.resumes;
