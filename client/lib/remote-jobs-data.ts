import type { LucideIcon } from "lucide-react";
import { Clock3, Globe2, HandCoins, Home, Laptop, PiggyBank } from "lucide-react";

export type RemoteType = "100% Remote" | "Work from Anywhere" | "Async First";
export type RemoteJobType = "Full-time" | "Part-time" | "Contract";
export type RemoteExperienceLevel =
  | "Entry level"
  | "Mid level"
  | "Senior level"
  | "Lead";

export type RemoteJob = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyTone: string;
  category: string;
  remoteType: RemoteType;
  jobType: RemoteJobType;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: RemoteExperienceLevel;
  locationRestriction: string;
  timezone: string;
  postedAt: string;
  postedDate: string;
  featured: boolean;
  asyncFirst: boolean;
  skills: string[];
  description: string;
  href: string;
};

export type RemoteFilterOption = {
  label: string;
  count?: number;
  checked?: boolean;
};

export type RemoteBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const remoteWorkBadges = [
  "Verified remote teams",
  "Timezone-friendly roles",
  "Transparent salary ranges",
];

export const remoteQuickFilters: RemoteFilterOption[] = [
  { label: "100% Remote", count: 128, checked: true },
  { label: "Work from Anywhere", count: 72 },
  { label: "Async First", count: 56 },
];

export const remoteJobCategories = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Customer Success",
  "Data",
];

export const remoteSortOptions = [
  "Most relevant",
  "Latest",
  "Salary high to low",
  "Salary low to high",
  "Most flexible",
] as const;

export const remoteJobs: RemoteJob[] = [
  {
    id: "remote-senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    company: "AtlasGrid",
    companyInitials: "AG",
    companyTone: "bg-blue-50 text-primary ring-blue-100",
    category: "Engineering",
    remoteType: "100% Remote",
    jobType: "Full-time",
    salary: "$120K - $155K",
    salaryMin: 120000,
    salaryMax: 155000,
    experienceLevel: "Senior level",
    locationRestriction: "Americas or EMEA",
    timezone: "UTC-5 to UTC+2",
    postedAt: "2 hours ago",
    postedDate: "Today",
    featured: true,
    asyncFirst: true,
    skills: ["React", "TypeScript", "Next.js", "Design Systems"],
    description:
      "Build polished product surfaces for distributed teams with strong ownership of frontend architecture and accessibility.",
    href: "/jobs/remote-senior-frontend-engineer",
  },
  {
    id: "remote-product-designer",
    title: "Remote Product Designer",
    company: "NexaWorks",
    companyInitials: "NW",
    companyTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    category: "Design",
    remoteType: "Work from Anywhere",
    jobType: "Full-time",
    salary: "$95K - $130K",
    salaryMin: 95000,
    salaryMax: 130000,
    experienceLevel: "Senior level",
    locationRestriction: "Worldwide",
    timezone: "4 hour overlap with UTC",
    postedAt: "1 day ago",
    postedDate: "Last 24 hours",
    featured: true,
    asyncFirst: true,
    skills: ["Figma", "UX Research", "Prototyping", "SaaS"],
    description:
      "Lead discovery and product design for remote-first collaboration tools used by hiring teams across global markets.",
    href: "/jobs/remote-product-designer",
  },
  {
    id: "remote-growth-marketer",
    title: "Growth Marketing Manager",
    company: "GrowthPilot",
    companyInitials: "GP",
    companyTone: "bg-amber-50 text-amber-700 ring-amber-100",
    category: "Marketing",
    remoteType: "Async First",
    jobType: "Contract",
    salary: "$70K - $92K",
    salaryMin: 70000,
    salaryMax: 92000,
    experienceLevel: "Mid level",
    locationRestriction: "Europe",
    timezone: "UTC+0 to UTC+3",
    postedAt: "3 days ago",
    postedDate: "Last 7 days",
    featured: false,
    asyncFirst: true,
    skills: ["Lifecycle", "SEO", "Analytics", "Copywriting"],
    description:
      "Own acquisition experiments, lifecycle campaigns, and reporting cadences for a remote-first growth team.",
    href: "/jobs/remote-growth-marketer",
  },
  {
    id: "remote-data-analyst",
    title: "Data Analyst, Product",
    company: "CareerMetric",
    companyInitials: "CM",
    companyTone: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    category: "Data",
    remoteType: "100% Remote",
    jobType: "Full-time",
    salary: "$82K - $108K",
    salaryMin: 82000,
    salaryMax: 108000,
    experienceLevel: "Mid level",
    locationRestriction: "APAC",
    timezone: "UTC+5 to UTC+10",
    postedAt: "5 days ago",
    postedDate: "Last 7 days",
    featured: false,
    asyncFirst: false,
    skills: ["SQL", "Python", "Dashboards", "Experimentation"],
    description:
      "Turn product and hiring marketplace data into clear insights for a distributed product organization.",
    href: "/jobs/remote-data-analyst",
  },
];

export const remoteBenefits: RemoteBenefit[] = [
  {
    title: "Better Work-Life Balance",
    description:
      "Find teams that value focused work, clear boundaries, and flexible schedules.",
    icon: Home,
  },
  {
    title: "Higher Savings",
    description:
      "Reduce commute and relocation costs while comparing transparent salary ranges.",
    icon: PiggyBank,
  },
  {
    title: "Global Opportunity",
    description:
      "Access roles from companies hiring across regions, timezones, and markets.",
    icon: Globe2,
  },
  {
    title: "Async Collaboration",
    description:
      "Join teams with strong documentation, thoughtful handoffs, and fewer meetings.",
    icon: Clock3,
  },
];

export const remoteHeroStats = [
  { label: "Remote roles", value: "6.2K+", icon: Laptop },
  { label: "Avg. salary", value: "$118K", icon: HandCoins },
  { label: "Global companies", value: "1.4K+", icon: Globe2 },
];
