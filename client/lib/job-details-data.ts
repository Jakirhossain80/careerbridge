import {
  BriefcaseBusiness,
  CalendarClock,
  CircleDollarSign,
  Clock3,
  GraduationCap,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export type JobDetailsMeta = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type JobSummary = {
  label: string;
  value: string;
  supportingText: string;
};

export type SimilarJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  href: string;
};

export type JobDetails = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyTone: string;
  companyTagline: string;
  companyLocation: string;
  companySize: string;
  companyIndustry: string;
  companyDescription: string;
  companyProfileHref: string;
  statusBadges: Array<{
    label: string;
    variant: "primary" | "success" | "warning" | "danger" | "neutral";
  }>;
  location: string;
  postedDate: string;
  jobType: string;
  experienceLevel: string;
  salaryRange: string;
  deadline: string;
  applicants: number;
  applicationRate: string;
  overview: string;
  responsibilities: string[];
  skills: string[];
  requiredExperience: string[];
  summaryCards: JobSummary[];
  similarJobs: SimilarJob[];
};

export const jobDetails: JobDetails[] = [
  {
    id: "frontend-engineer-react",
    title: "Frontend Engineer, React",
    company: "BrightPath Labs",
    companyInitials: "BL",
    companyTone: "bg-blue-50 text-primary ring-blue-100",
    companyTagline: "Customer experience products for fast-growing teams",
    companyLocation: "Dhaka, Bangladesh",
    companySize: "51-200 employees",
    companyIndustry: "Software & Cloud",
    companyDescription:
      "BrightPath Labs builds collaboration and customer-facing workflow tools for regional SaaS companies. The product team values practical engineering, accessible interfaces, and reliable delivery.",
    companyProfileHref: "/companies/brightpath-labs",
    statusBadges: [
      { label: "Featured", variant: "primary" },
      { label: "Actively hiring", variant: "success" },
      { label: "Hybrid", variant: "neutral" },
    ],
    location: "Dhaka, Bangladesh",
    postedDate: "June 15, 2026",
    jobType: "Full-time",
    experienceLevel: "Mid level",
    salaryRange: "$70K - $98K",
    deadline: "July 15, 2026",
    applicants: 86,
    applicationRate: "High match rate",
    overview:
      "Build fast, accessible customer-facing web applications with React, TypeScript, reusable UI patterns, and thoughtful performance work. You will partner with product, design, and backend engineers to ship polished experiences across the CareerBridge partner ecosystem.",
    responsibilities: [
      "Develop responsive product interfaces using React, Next.js, TypeScript, and Tailwind CSS.",
      "Collaborate with designers to refine interaction details, component states, and accessibility behavior.",
      "Integrate REST APIs, handle loading and error states, and keep frontend data flows predictable.",
      "Improve page performance, Core Web Vitals, and frontend observability for production features.",
      "Contribute to shared component patterns, code reviews, and release quality checks.",
    ],
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Accessibility",
      "REST APIs",
      "Performance",
      "Git",
    ],
    requiredExperience: [
      "3+ years building production web applications with React.",
      "Strong TypeScript fundamentals and comfort working in component-driven codebases.",
      "Experience translating product requirements and design specs into responsive interfaces.",
      "Working knowledge of accessibility, browser debugging, and frontend testing practices.",
    ],
    summaryCards: [
      {
        label: "Applicants",
        value: "86",
        supportingText: "24 reviewed this week",
      },
      {
        label: "Match",
        value: "92%",
        supportingText: "Based on required skills",
      },
      {
        label: "Response",
        value: "3 days",
        supportingText: "Average employer reply",
      },
    ],
    similarJobs: [
      {
        id: "senior-product-designer",
        title: "Senior Product Designer",
        company: "NexaWorks",
        location: "Remote",
        salary: "$95K - $125K",
        href: "/jobs/senior-product-designer",
      },
      {
        id: "backend-api-engineer",
        title: "Backend API Engineer",
        company: "GreenLedger",
        location: "Rajshahi, Bangladesh",
        salary: "$82K - $110K",
        href: "/jobs/backend-api-engineer",
      },
      {
        id: "data-analyst-growth",
        title: "Data Analyst, Growth",
        company: "CareerMetric",
        location: "Chattogram, Bangladesh",
        salary: "$52K - $76K",
        href: "/jobs/data-analyst-growth",
      },
    ],
  },
];

export const getJobDetailsById = (id: string) =>
  jobDetails.find((job) => job.id === id);

export const buildJobMeta = (job: JobDetails): JobDetailsMeta[] => [
  { label: "Company", value: job.company, icon: BriefcaseBusiness },
  { label: "Location", value: job.location, icon: MapPin },
  { label: "Posted date", value: job.postedDate, icon: Clock3 },
  { label: "Job type", value: job.jobType, icon: BriefcaseBusiness },
  { label: "Experience", value: job.experienceLevel, icon: GraduationCap },
  { label: "Salary", value: job.salaryRange, icon: CircleDollarSign },
  { label: "Deadline", value: job.deadline, icon: CalendarClock },
];
