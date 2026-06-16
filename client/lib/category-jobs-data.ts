import { categories, type CareerCategory } from "@/lib/categories-data";
import { jobs, type Job, type JobsFilterGroup } from "@/lib/jobs-data";

export type CategoryJobsData = {
  category: CareerCategory;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  heroImageUrl: string;
  heroImageAlt: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  jobs: Job[];
  filterGroups: JobsFilterGroup[];
  toolbarSummary: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    shownCount: number;
  };
};

const developmentCategory = categories.find(
  (category) => category.slug === "development",
);

const developmentJobs: Job[] = [
  jobs.find((job) => job.id === "frontend-engineer-react"),
  jobs.find((job) => job.id === "backend-api-engineer"),
  {
    id: "full-stack-platform-engineer",
    title: "Full-stack Platform Engineer",
    company: "CloudHarbor",
    companyInitials: "CH",
    companyTone: "bg-sky-50 text-sky-700 ring-sky-100",
    category: "Engineering",
    industry: "Software & Cloud",
    location: "Remote",
    workMode: "Remote",
    jobType: "Full-time",
    salary: "$88K - $118K",
    salaryMin: 88000,
    salaryMax: 118000,
    experienceLevel: "Mid level",
    postedAt: "4 hours ago",
    postedDate: "Today",
    applicants: 54,
    skills: ["React", "Node.js", "AWS", "PostgreSQL"],
    description:
      "Build customer-facing workflows and the platform services behind them for a fast-growing cloud operations product.",
    featured: true,
    href: "/jobs/full-stack-platform-engineer",
  },
  {
    id: "mobile-engineer-react-native",
    title: "Mobile Engineer, React Native",
    company: "RoutePilot",
    companyInitials: "RP",
    companyTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    category: "Engineering",
    industry: "Logistics Tech",
    location: "Dhaka, Bangladesh",
    workMode: "Hybrid",
    jobType: "Contract",
    salary: "$62K - $84K",
    salaryMin: 62000,
    salaryMax: 84000,
    experienceLevel: "Mid level",
    postedAt: "2 days ago",
    postedDate: "Last 7 days",
    applicants: 39,
    skills: ["React Native", "TypeScript", "GraphQL", "Testing"],
    description:
      "Ship reliable mobile experiences for field teams, with offline-first flows, clean APIs, and measurable performance.",
    href: "/jobs/mobile-engineer-react-native",
  },
].filter(Boolean) as Job[];

const developmentFilterGroups: JobsFilterGroup[] = [
  {
    title: "Job type",
    options: [
      { label: "Full-time", count: 684, checked: true },
      { label: "Part-time", count: 126 },
      { label: "Contract", count: 188 },
      { label: "Internship", count: 72 },
    ],
  },
  {
    title: "Remote / onsite / hybrid",
    options: [
      { label: "Remote", count: 426, checked: true },
      { label: "On-site", count: 284 },
      { label: "Hybrid", count: 530 },
    ],
  },
  {
    title: "Experience level",
    options: [
      { label: "Entry level", count: 214 },
      { label: "Mid level", count: 552, checked: true },
      { label: "Senior level", count: 386 },
      { label: "Lead / Manager", count: 88 },
    ],
  },
  {
    title: "Category",
    options: [
      { label: "Full-stack", count: 312, checked: true },
      { label: "Backend", count: 286 },
      { label: "Mobile", count: 164 },
      { label: "DevOps", count: 148 },
    ],
  },
  {
    title: "Industry",
    options: [
      { label: "Software & Cloud", count: 418 },
      { label: "FinTech", count: 196 },
      { label: "Logistics Tech", count: 92 },
      { label: "HealthTech", count: 78 },
    ],
  },
  {
    title: "Posted date",
    type: "radio",
    options: [
      { label: "Today", count: 64 },
      { label: "Last 24 hours", count: 148, checked: true },
      { label: "Last 7 days", count: 512 },
      { label: "Last 30 days", count: 1240 },
    ],
  },
  {
    title: "Company",
    options: [
      { label: "BrightPath Labs", count: 24 },
      { label: "CloudHarbor", count: 18 },
      { label: "GreenLedger", count: 16 },
      { label: "RoutePilot", count: 11 },
    ],
  },
];

export const categoryJobsData: Record<string, CategoryJobsData> =
  developmentCategory
    ? {
        development: {
          category: developmentCategory,
          eyebrow: "Development",
          title: "Development Jobs",
          description:
            "Find frontend, backend, full-stack, mobile, DevOps, and platform roles from teams hiring software talent now.",
          tags: ["Full-stack", "Backend", "Mobile", "DevOps"],
          heroImageUrl:
            developmentCategory.imageUrl ??
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
          heroImageAlt:
            developmentCategory.imageAlt ??
            "Developer workspace with code on a laptop screen",
          stats: [
            { label: "Open roles", value: "1,240" },
            { label: "Remote roles", value: "426" },
            { label: "Hiring teams", value: "310" },
          ],
          jobs: developmentJobs,
          filterGroups: developmentFilterGroups,
          toolbarSummary: "Matched from 1,240 active development openings",
          pagination: {
            currentPage: 1,
            totalPages: 4,
            shownCount: 24,
          },
        },
      }
    : {};

export function getCategoryJobsData(slug: string) {
  return categoryJobsData[slug];
}
