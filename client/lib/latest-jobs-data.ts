import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  Clock3,
  HandCoins,
  MapPin,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export type LatestJobType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type LatestExperienceLevel =
  | "Entry level"
  | "Mid level"
  | "Senior level"
  | "Lead";
export type LatestPostedDate =
  | "Today"
  | "Last 24 hours"
  | "Last 3 days"
  | "Last 7 days";

export type LatestJob = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyTone: string;
  category: string;
  featured: boolean;
  jobType: LatestJobType;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: LatestExperienceLevel;
  location: string;
  postedAt: string;
  postedDate: LatestPostedDate;
  applicants: number;
  skills: string[];
  description: string;
  href: string;
};

export type LatestFilterOption = {
  label: string;
  count?: number;
  checked?: boolean;
};

export type LatestBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const latestJobBadges = [
  "Fresh roles added daily",
  "Apply before queues build",
  "Updated salary and company signals",
];

export const latestQuickFilters: LatestFilterOption[] = [
  { label: "Posted today", count: 64, checked: true },
  { label: "Last 24 hours", count: 128 },
  { label: "Remote friendly", count: 92 },
  { label: "Featured companies", count: 45 },
];

export const latestJobCategories = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Operations",
  "Data",
];

export const latestSortOptions = [
  "Newest First",
  "Oldest First",
  "Salary High to Low",
  "Salary Low to High",
] as const;

export const latestJobs: LatestJob[] = [
  {
    id: "latest-frontend-engineer",
    title: "Frontend Engineer",
    company: "LaunchGrid",
    companyInitials: "LG",
    companyTone: "bg-blue-50 text-primary ring-blue-100",
    category: "Engineering",
    featured: true,
    jobType: "Full-time",
    salary: "$105K - $138K",
    salaryMin: 105000,
    salaryMax: 138000,
    experienceLevel: "Mid level",
    location: "Remote, United States",
    postedAt: "35 minutes ago",
    postedDate: "Today",
    applicants: 12,
    skills: ["React", "TypeScript", "Next.js", "Design Systems"],
    description:
      "Build polished candidate and employer workflows for a fast-growing hiring marketplace.",
    href: "/jobs/latest-frontend-engineer",
  },
  {
    id: "latest-talent-operations-manager",
    title: "Talent Operations Manager",
    company: "PeoplePath",
    companyInitials: "PP",
    companyTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    category: "Operations",
    featured: false,
    jobType: "Full-time",
    salary: "$88K - $116K",
    salaryMin: 88000,
    salaryMax: 116000,
    experienceLevel: "Senior level",
    location: "Boston, MA",
    postedAt: "2 hours ago",
    postedDate: "Today",
    applicants: 18,
    skills: ["Hiring Ops", "ATS", "Process Design", "Reporting"],
    description:
      "Improve recruiting operations, hiring analytics, and stakeholder workflows for distributed teams.",
    href: "/jobs/latest-talent-operations-manager",
  },
  {
    id: "latest-product-designer",
    title: "Product Designer",
    company: "BrightHire Studio",
    companyInitials: "BS",
    companyTone: "bg-violet-50 text-violet-700 ring-violet-100",
    category: "Design",
    featured: true,
    jobType: "Contract",
    salary: "$75K - $102K",
    salaryMin: 75000,
    salaryMax: 102000,
    experienceLevel: "Mid level",
    location: "San Francisco, CA",
    postedAt: "5 hours ago",
    postedDate: "Today",
    applicants: 9,
    skills: ["Figma", "UX Research", "Prototyping", "SaaS"],
    description:
      "Design candidate-facing product surfaces and test high-confidence improvements with research partners.",
    href: "/jobs/latest-product-designer",
  },
  {
    id: "latest-data-analyst",
    title: "Data Analyst",
    company: "SignalWorks",
    companyInitials: "SW",
    companyTone: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    category: "Data",
    featured: false,
    jobType: "Full-time",
    salary: "$82K - $104K",
    salaryMin: 82000,
    salaryMax: 104000,
    experienceLevel: "Entry level",
    location: "Chicago, IL",
    postedAt: "1 day ago",
    postedDate: "Last 24 hours",
    applicants: 27,
    skills: ["SQL", "Looker", "Data Quality", "Dashboards"],
    description:
      "Turn hiring activity, funnel health, and marketplace data into practical weekly insights.",
    href: "/jobs/latest-data-analyst",
  },
  {
    id: "latest-growth-marketer",
    title: "Growth Marketing Specialist",
    company: "CareerPilot",
    companyInitials: "CP",
    companyTone: "bg-amber-50 text-amber-800 ring-amber-100",
    category: "Marketing",
    featured: false,
    jobType: "Part-time",
    salary: "$58K - $76K",
    salaryMin: 58000,
    salaryMax: 76000,
    experienceLevel: "Mid level",
    location: "Austin, TX",
    postedAt: "2 days ago",
    postedDate: "Last 3 days",
    applicants: 31,
    skills: ["Lifecycle", "SEO", "Content", "Analytics"],
    description:
      "Support acquisition campaigns, candidate lifecycle experiments, and employer content programs.",
    href: "/jobs/latest-growth-marketer",
  },
];

export const latestBenefits: LatestBenefit[] = [
  {
    title: "Less Competition",
    description:
      "Fresh postings often have smaller applicant pools, giving strong applications more room to stand out.",
    icon: Users,
  },
  {
    title: "Faster Recruiter Review",
    description:
      "Hiring teams are usually most active right after a role opens and requirements are fresh.",
    icon: BellRing,
  },
  {
    title: "Better Role Context",
    description:
      "New listings make it easier to compare current salary ranges, locations, and hiring priorities.",
    icon: SearchCheck,
  },
  {
    title: "Earlier Interview Slots",
    description:
      "Apply early to reach teams before interview schedules and shortlists fill up.",
    icon: Rocket,
  },
];

export const latestHeroStats = [
  { label: "New this week", value: "420+", icon: CalendarClock },
  { label: "Hiring companies", value: "180+", icon: BriefcaseBusiness },
  { label: "Avg. salary", value: "$96K", icon: HandCoins },
];

export const latestHeroHighlights = [
  { label: "Just posted", icon: Clock3 },
  { label: "Verified roles", icon: BadgeCheck },
  { label: "Top locations", icon: MapPin },
  { label: "Early applicants", icon: TrendingUp },
];

export const latestHeroTrustSignals = [
  { label: "Freshness checked", icon: ShieldCheck },
  { label: "Fast-moving teams", icon: Sparkles },
];
