import type {
  JobSeekerProfile,
  JobSeekerProfileStats,
  JobSeekerResumeSummary,
} from "@/types/job-seeker-profile.types";

export const mockJobSeekerProfile: JobSeekerProfile = {
  _id: "profile-001",
  fullName: "Ayesha Rahman",
  email: "ayesha.rahman@example.com",
  phone: "+880 1712 345678",
  avatar: "",
  coverImage: "",
  headline: "Frontend Engineer building accessible SaaS products",
  location: "Dhaka, Bangladesh",
  joinedAt: "2025-02-12T08:30:00.000Z",
  profileCompletion: 86,
  about:
    "Product-minded frontend engineer with experience building hiring workflows, dashboards, and design-system driven interfaces for fast-growing teams.",
  yearsOfExperience: 4,
  currentDesignation: "Frontend Engineer",
  preferredRole: "Senior Frontend Engineer",
  technicalSkills: [
    "React",
    "Next.js",
    "TypeScript",
    "TanStack Query",
    "Tailwind CSS",
    "Node.js",
  ],
  softSkills: ["Communication", "Ownership", "Mentoring", "Problem solving"],
  experience: [
    {
      _id: "exp-001",
      title: "Frontend Engineer",
      company: "BrightPath Labs",
      employmentType: "Full-time",
      startDate: "2023-04-01",
      currentlyWorking: true,
      description:
        "Built dashboard experiences, reusable UI components, and data-heavy workflows with React, TypeScript, and query caching.",
    },
    {
      _id: "exp-002",
      title: "Junior Web Developer",
      company: "Northstar Digital",
      employmentType: "Full-time",
      startDate: "2021-01-15",
      endDate: "2023-03-20",
      description:
        "Implemented responsive landing pages, candidate forms, and content-driven pages across client projects.",
    },
  ],
  education: [
    {
      _id: "edu-001",
      degree: "B.Sc. in Computer Science",
      institution: "University of Dhaka",
      fieldOfStudy: "Software Engineering",
      graduationYear: 2020,
      startYear: 2016,
      endYear: 2020,
    },
  ],
  projects: [
    {
      _id: "project-001",
      title: "Candidate Pipeline Dashboard",
      description:
        "A dashboard for tracking applications, interviews, and hiring tasks across multiple teams.",
      projectUrl: "https://example.com/pipeline",
      githubUrl: "https://github.com/example/pipeline",
      technologies: ["Next.js", "TypeScript", "MongoDB"],
    },
    {
      _id: "project-002",
      title: "Resume Matcher",
      description:
        "A profile scoring tool that compares resume skills with job descriptions and recommends improvements.",
      projectUrl: "https://example.com/resume-matcher",
      technologies: ["React", "Node.js", "TanStack Query"],
    },
  ],
  resume: {
    _id: "resume-001",
    fileName: "Ayesha_Rahman_Resume.pdf",
    fileUrl: "/resumes/ayesha-rahman-resume.pdf",
    uploadedAt: "2026-05-18T10:15:00.000Z",
    isDefault: true,
  },
  linkedinUrl: "https://www.linkedin.com/in/ayesha-rahman",
  githubUrl: "https://github.com/ayesharahman",
  portfolioUrl: "https://ayesharahman.dev",
  otherLinks: [{ label: "Dribbble", url: "https://dribbble.com/example" }],
  stats: {
    appliedJobs: 24,
    savedJobs: 12,
    interviews: 5,
    profileViews: 148,
  },
};

export const mockJobSeekerProfileStats: JobSeekerProfileStats = {
  appliedJobs: 24,
  savedJobs: 12,
  interviews: 5,
  profileViews: 148,
};

export const mockJobSeekerResumes: JobSeekerResumeSummary[] = [
  mockJobSeekerProfile.resume,
].filter(Boolean) as JobSeekerResumeSummary[];
