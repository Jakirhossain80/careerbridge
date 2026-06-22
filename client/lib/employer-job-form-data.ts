import type {
  EmployerJobCompany,
  EmployerJobFormData,
} from "@/types/employer-job";

export const jobCategories = [
  "Software Engineering",
  "Product & Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Data & Analytics",
  "People Operations",
  "Finance",
];

export const experienceLevels = [
  "Entry level",
  "Mid level",
  "Senior level",
  "Lead / Principal",
  "Manager",
];

export const educationLevels = [
  "No degree required",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate",
];

export const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
];

export const workModes = ["Remote", "Hybrid", "On-site"];

export const hiringUrgencies = [
  "Hiring this month",
  "Urgent hire",
  "Flexible timeline",
];

export const applicationMethods = [
  "CareerBridge quick apply",
  "External application URL",
  "Email recruiter",
];

export const mockEmployerCompany: EmployerJobCompany = {
  id: "company-novatech",
  name: "NovaTech Solutions",
  logoInitials: "NT",
  industry: "Technology",
  location: "Austin, TX",
};

export const initialEmployerJobFormData: EmployerJobFormData = {
  id: "job-draft-001",
  title: "Senior Frontend Engineer",
  slug: "senior-frontend-engineer",
  category: "Software Engineering",
  jobType: "Full-time",
  workMode: "Hybrid",
  location: "Austin, TX",
  salaryMin: 115000,
  salaryMax: 145000,
  currency: "USD",
  experienceLevel: "Senior level",
  educationLevel: "Bachelor's degree",
  skills: ["React", "TypeScript", "Next.js", "Design Systems"],
  description:
    "Lead frontend delivery for customer-facing products used by hiring teams and candidates across CareerBridge.",
  responsibilities:
    "Own accessible, responsive interfaces; collaborate with product and design; improve performance and frontend quality across releases.",
  requirements:
    "Strong React and TypeScript experience, practical accessibility knowledge, and comfort working in a cross-functional product team.",
  benefits:
    "Flexible working model, learning budget, health coverage, paid time off, and a collaborative engineering culture.",
  applicationDeadline: "2026-07-31",
  vacancies: 2,
  hiringUrgency: "Hiring this month",
  applicationMethod: "CareerBridge quick apply",
  externalApplicationUrl: "",
  status: "draft",
  publishedAt: null,
  employerId: "employer-ariana",
  companyId: "company-novatech",
};
