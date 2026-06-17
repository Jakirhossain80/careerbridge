import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Crown,
  HandCoins,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export type FeaturedJobType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type FeaturedExperienceLevel =
  | "Entry level"
  | "Mid level"
  | "Senior level"
  | "Lead";
export type FeaturedStatus = "Featured" | "Urgent" | "Top company";

export type FeaturedJob = {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyTone: string;
  category: string;
  featuredStatus: FeaturedStatus;
  featured: boolean;
  jobType: FeaturedJobType;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: FeaturedExperienceLevel;
  location: string;
  postedAt: string;
  postedDate: string;
  applicants: number;
  skills: string[];
  description: string;
  href: string;
};

export type FeaturedFilterOption = {
  label: string;
  count?: number;
  checked?: boolean;
};

export type FeaturedBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const featuredJobBadges = [
  "Employer highlighted roles",
  "Fast response hiring teams",
  "Verified salary ranges",
];

export const featuredQuickFilters: FeaturedFilterOption[] = [
  { label: "Featured", count: 86, checked: true },
  { label: "Urgent hiring", count: 34 },
  { label: "Top companies", count: 42 },
  { label: "Posted this week", count: 118 },
];

export const featuredJobCategories = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Operations",
  "Data",
];

export const featuredSortOptions = [
  "Most relevant",
  "Latest",
  "Salary high to low",
  "Salary low to high",
  "Most applied",
] as const;

export const featuredJobs: FeaturedJob[] = [
  {
    id: "featured-senior-product-engineer",
    title: "Senior Product Engineer",
    company: "BridgeWorks",
    companyInitials: "BW",
    companyTone: "bg-blue-50 text-primary ring-blue-100",
    category: "Engineering",
    featuredStatus: "Featured",
    featured: true,
    jobType: "Full-time",
    salary: "$125K - $165K",
    salaryMin: 125000,
    salaryMax: 165000,
    experienceLevel: "Senior level",
    location: "New York, NY",
    postedAt: "3 hours ago",
    postedDate: "Today",
    applicants: 28,
    skills: ["React", "TypeScript", "Node.js", "Product"],
    description:
      "Own high-impact product surfaces across the CareerBridge hiring workflow with a strong focus on reliability and user experience.",
    href: "/jobs/featured-senior-product-engineer",
  },
  {
    id: "featured-growth-product-manager",
    title: "Growth Product Manager",
    company: "TalentLoop",
    companyInitials: "TL",
    companyTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    category: "Product",
    featuredStatus: "Top company",
    featured: true,
    jobType: "Full-time",
    salary: "$110K - $145K",
    salaryMin: 110000,
    salaryMax: 145000,
    experienceLevel: "Senior level",
    location: "Remote, United States",
    postedAt: "1 day ago",
    postedDate: "Last 24 hours",
    applicants: 41,
    skills: ["Roadmaps", "Analytics", "Experimentation", "SaaS"],
    description:
      "Lead growth experiments, onboarding improvements, and marketplace activation for a hiring platform serving fast-moving teams.",
    href: "/jobs/featured-growth-product-manager",
  },
  {
    id: "featured-brand-designer",
    title: "Brand Designer",
    company: "Northstar Labs",
    companyInitials: "NL",
    companyTone: "bg-violet-50 text-violet-700 ring-violet-100",
    category: "Design",
    featuredStatus: "Urgent",
    featured: true,
    jobType: "Contract",
    salary: "$80K - $105K",
    salaryMin: 80000,
    salaryMax: 105000,
    experienceLevel: "Mid level",
    location: "Austin, TX",
    postedAt: "2 days ago",
    postedDate: "Last 7 days",
    applicants: 19,
    skills: ["Figma", "Brand Systems", "Campaigns", "Illustration"],
    description:
      "Create campaign systems, landing page visuals, and hiring brand assets for a company expanding its employer platform.",
    href: "/jobs/featured-brand-designer",
  },
  {
    id: "featured-data-operations-analyst",
    title: "Data Operations Analyst",
    company: "MetricHire",
    companyInitials: "MH",
    companyTone: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    category: "Data",
    featuredStatus: "Featured",
    featured: true,
    jobType: "Full-time",
    salary: "$78K - $98K",
    salaryMin: 78000,
    salaryMax: 98000,
    experienceLevel: "Mid level",
    location: "Chicago, IL",
    postedAt: "4 days ago",
    postedDate: "Last 7 days",
    applicants: 23,
    skills: ["SQL", "Dashboards", "Data Quality", "Reporting"],
    description:
      "Improve hiring operations reporting, data quality checks, and weekly insights for marketplace and customer success leaders.",
    href: "/jobs/featured-data-operations-analyst",
  },
];

export const featuredBenefits: FeaturedBenefit[] = [
  {
    title: "Priority Visibility",
    description:
      "Featured roles are highlighted by employers who want qualified candidates to discover them faster.",
    icon: Sparkles,
  },
  {
    title: "Verified Companies",
    description:
      "Compare opportunities from hiring teams with clear company details, pay bands, and role expectations.",
    icon: ShieldCheck,
  },
  {
    title: "Faster Hiring Signals",
    description:
      "Spot urgent roles, recent posts, and active teams before spending time on a full application.",
    icon: Rocket,
  },
  {
    title: "Stronger Matches",
    description:
      "Use category, salary, location, and experience filters to focus on roles that fit your goals.",
    icon: TrendingUp,
  },
];

export const featuredHeroStats = [
  { label: "Featured roles", value: "860+", icon: BadgeCheck },
  { label: "Hiring companies", value: "320+", icon: BriefcaseBusiness },
  { label: "Avg. salary", value: "$112K", icon: HandCoins },
];

export const featuredHeroHighlights = [
  { label: "Priority review", icon: Crown },
  { label: "Fresh postings", icon: Clock3 },
  { label: "Top locations", icon: MapPin },
  { label: "Active teams", icon: Users },
];
