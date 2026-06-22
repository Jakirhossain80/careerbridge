import type { ApplicantDetails } from "@/types/application.types";

export const mockApplicantDetails: ApplicantDetails[] = [
  {
    _id: "app-001",
    jobId: "job-frontend-lead",
    jobTitle: "Senior Frontend Engineer",
    applicantId: "candidate-alex-morgan",
    applicantName: "Alex Morgan",
    applicantEmail: "alex.morgan@example.com",
    applicantPhone: "+1 (415) 555-0198",
    applicantAvatar: "",
    location: "San Francisco, CA",
    portfolioUrl: "https://alexmorgan.dev",
    linkedinUrl: "https://linkedin.com/in/alexmorgan",
    githubUrl: "https://github.com/alexmorgan",
    resumeUrl: "/resumes/alex-morgan.pdf",
    resumeFileName: "alex-morgan-resume.pdf",
    coverLetter:
      "I have led React and design-system work for high-growth SaaS products and would be excited to help CareerBridge scale its employer tools. My recent role combined hands-on frontend delivery with mentoring engineers and partnering closely with product designers.",
    skills: ["React", "TypeScript", "Next.js", "Design Systems", "Testing"],
    experienceYears: 7,
    education: "B.S. Computer Science, University of California",
    careerSummary:
      "Frontend engineer focused on scalable dashboard experiences, component systems, accessibility, and measurable product quality.",
    matchScore: 96,
    status: "shortlisted",
    appliedAt: "2026-06-20T09:24:00.000Z",
    notes: [
      {
        _id: "note-001",
        authorName: "Nadia Rahman",
        message: "Strong dashboard and systems experience. Prioritize for technical screen.",
        createdAt: "2026-06-20T13:12:00.000Z",
      },
    ],
    statusHistory: [
      {
        status: "applied",
        label: "Applied",
        createdAt: "2026-06-20T09:24:00.000Z",
      },
      {
        status: "under_review",
        label: "Under Review",
        createdAt: "2026-06-20T10:05:00.000Z",
        note: "Application opened by recruiting team.",
      },
      {
        status: "shortlisted",
        label: "Shortlisted",
        createdAt: "2026-06-20T13:15:00.000Z",
      },
    ],
  },
];
