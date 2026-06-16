import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Building2, MapPinned, UsersRound } from "lucide-react";

export type Job = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyTone: string;
  category: string;
  industry: string;
  location: string;
  workMode: "Remote" | "On-site" | "Hybrid";
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  salary: string;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: string;
  postedAt: string;
  postedDate: string;
  applicants: number;
  skills: string[];
  description: string;
  featured?: boolean;
  urgent?: boolean;
  href: string;
};

export type JobsFilterGroup = {
  title: string;
  type?: "checkbox" | "radio";
  options: Array<{
    label: string;
    count?: number;
    checked?: boolean;
  }>;
};

export type JobsHeroStat = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export const jobsHeroStats: JobsHeroStat[] = [
  {
    label: "Open roles",
    value: "18K+",
    icon: BriefcaseBusiness,
  },
  {
    label: "Hiring companies",
    value: "4.8K+",
    icon: Building2,
  },
  {
    label: "Remote roles",
    value: "6.2K+",
    icon: MapPinned,
  },
  {
    label: "Active applicants",
    value: "35K+",
    icon: UsersRound,
  },
];

export const jobs: Job[] = [
  {
    id: "senior-product-designer",
    title: "Senior Product Designer",
    company: "NexaWorks",
    companyInitials: "NW",
    companyTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    category: "Design",
    industry: "Product & Design",
    location: "Remote",
    workMode: "Remote",
    jobType: "Full-time",
    salary: "$95K - $125K",
    salaryMin: 95000,
    salaryMax: 125000,
    experienceLevel: "Senior level",
    postedAt: "2 hours ago",
    postedDate: "Today",
    applicants: 128,
    skills: ["Figma", "Design Systems", "UX Research", "SaaS"],
    description:
      "Lead product design for collaborative SaaS tools, shaping discovery, design systems, and polished end-to-end workflows.",
    featured: true,
    href: "/jobs/senior-product-designer",
  },
  {
    id: "frontend-engineer-react",
    title: "Frontend Engineer, React",
    company: "BrightPath Labs",
    companyInitials: "BL",
    companyTone: "bg-blue-50 text-primary ring-blue-100",
    category: "Engineering",
    industry: "Software & Cloud",
    location: "Dhaka, Bangladesh",
    workMode: "Hybrid",
    jobType: "Full-time",
    salary: "$70K - $98K",
    salaryMin: 70000,
    salaryMax: 98000,
    experienceLevel: "Mid level",
    postedAt: "1 day ago",
    postedDate: "Last 24 hours",
    applicants: 86,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    description:
      "Build fast customer-facing web apps with React, TypeScript, reusable UI patterns, and thoughtful performance work.",
    featured: true,
    href: "/jobs/frontend-engineer-react",
  },
  {
    id: "data-analyst-growth",
    title: "Data Analyst, Growth",
    company: "CareerMetric",
    companyInitials: "CM",
    companyTone: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    category: "Data",
    industry: "Data Intelligence",
    location: "Chattogram, Bangladesh",
    workMode: "On-site",
    jobType: "Full-time",
    salary: "$52K - $76K",
    salaryMin: 52000,
    salaryMax: 76000,
    experienceLevel: "Mid level",
    postedAt: "3 days ago",
    postedDate: "Last 7 days",
    applicants: 64,
    skills: ["SQL", "Python", "BI", "Experimentation"],
    description:
      "Turn hiring funnel and product data into dashboards, insights, and practical recommendations for growth teams.",
    href: "/jobs/data-analyst-growth",
  },
  {
    id: "talent-operations-lead",
    title: "Talent Operations Lead",
    company: "SkillForge",
    companyInitials: "SF",
    companyTone: "bg-violet-50 text-violet-700 ring-violet-100",
    category: "Human Resources",
    industry: "EdTech",
    location: "Sylhet, Bangladesh",
    workMode: "Hybrid",
    jobType: "Contract",
    salary: "$48K - $66K",
    salaryMin: 48000,
    salaryMax: 66000,
    experienceLevel: "Senior level",
    postedAt: "5 days ago",
    postedDate: "Last 7 days",
    applicants: 42,
    skills: ["Recruiting", "ATS", "Operations", "Mentorship"],
    description:
      "Coordinate talent programs, mentor candidate cohorts, and improve the hiring operations that support partner employers.",
    href: "/jobs/talent-operations-lead",
  },
  {
    id: "marketing-campaign-specialist",
    title: "Marketing Campaign Specialist",
    company: "GrowthPilot",
    companyInitials: "GP",
    companyTone: "bg-amber-50 text-amber-700 ring-amber-100",
    category: "Marketing",
    industry: "Marketing & Growth",
    location: "Dhaka, Bangladesh",
    workMode: "On-site",
    jobType: "Part-time",
    salary: "$34K - $48K",
    salaryMin: 34000,
    salaryMax: 48000,
    experienceLevel: "Entry level",
    postedAt: "1 week ago",
    postedDate: "Last 14 days",
    applicants: 95,
    skills: ["CRM", "Copywriting", "Analytics", "Lifecycle"],
    description:
      "Plan and launch acquisition and lifecycle campaigns across email, paid channels, and customer communication touchpoints.",
    urgent: true,
    href: "/jobs/marketing-campaign-specialist",
  },
  {
    id: "backend-api-engineer",
    title: "Backend API Engineer",
    company: "GreenLedger",
    companyInitials: "GL",
    companyTone: "bg-lime-50 text-lime-700 ring-lime-100",
    category: "Engineering",
    industry: "FinTech",
    location: "Rajshahi, Bangladesh",
    workMode: "Hybrid",
    jobType: "Full-time",
    salary: "$82K - $110K",
    salaryMin: 82000,
    salaryMax: 110000,
    experienceLevel: "Senior level",
    postedAt: "2 weeks ago",
    postedDate: "Last 30 days",
    applicants: 73,
    skills: ["Node.js", "APIs", "PostgreSQL", "Security"],
    description:
      "Design reliable payment, reporting, and finance APIs for SME products with strong security and observability practices.",
    href: "/jobs/backend-api-engineer",
  },
];

export const jobsFilterGroups: JobsFilterGroup[] = [
  {
    title: "Job type",
    options: [
      { label: "Full-time", count: 124, checked: true },
      { label: "Part-time", count: 48 },
      { label: "Contract", count: 36 },
      { label: "Internship", count: 22 },
    ],
  },
  {
    title: "Work mode",
    options: [
      { label: "Remote", count: 92, checked: true },
      { label: "On-site", count: 64 },
      { label: "Hybrid", count: 118 },
    ],
  },
  {
    title: "Experience level",
    options: [
      { label: "Entry level", count: 54 },
      { label: "Mid level", count: 136, checked: true },
      { label: "Senior level", count: 89 },
      { label: "Lead / Manager", count: 37 },
    ],
  },
  {
    title: "Category",
    options: [
      { label: "Engineering", count: 144, checked: true },
      { label: "Design", count: 68 },
      { label: "Data", count: 52 },
      { label: "Marketing", count: 47 },
      { label: "Human Resources", count: 29 },
    ],
  },
  {
    title: "Industry",
    options: [
      { label: "Software & Cloud", count: 112 },
      { label: "Product & Design", count: 76 },
      { label: "Data Intelligence", count: 58 },
      { label: "FinTech", count: 44 },
      { label: "EdTech", count: 31 },
    ],
  },
  {
    title: "Posted date",
    type: "radio",
    options: [
      { label: "Today", count: 18 },
      { label: "Last 24 hours", count: 42, checked: true },
      { label: "Last 7 days", count: 128 },
      { label: "Last 30 days", count: 256 },
    ],
  },
  {
    title: "Company",
    options: [
      { label: "BrightPath Labs", count: 24 },
      { label: "NexaWorks", count: 18 },
      { label: "CareerMetric", count: 16 },
      { label: "SkillForge", count: 12 },
      { label: "GrowthPilot", count: 9 },
    ],
  },
];

export const sortOptions = [
  "Latest",
  "Oldest",
  "Salary high to low",
  "Salary low to high",
  "Most applied",
] as const;
