export type CategoryIconKey =
  | "code"
  | "chart"
  | "briefcase"
  | "design"
  | "support"
  | "megaphone"
  | "shield"
  | "book"
  | "heart"
  | "bank"
  | "cloud"
  | "users";

export type CareerCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: CategoryIconKey;
  availableJobs: number;
  featured?: boolean;
  popular?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  tone: string;
};

export const categories: CareerCategory[] = [
  {
    id: "cat-development",
    name: "Software Development",
    slug: "development",
    description:
      "Frontend, backend, mobile, QA, DevOps, and platform engineering roles.",
    icon: "code",
    availableJobs: 1240,
    featured: true,
    popular: true,
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Developer workspace with code on a laptop screen",
    tone: "bg-blue-50 text-primary ring-blue-100 dark:bg-blue-950 dark:ring-blue-900",
  },
  {
    id: "cat-data",
    name: "Data & Analytics",
    slug: "data-analytics",
    description:
      "Data science, business intelligence, analytics engineering, and research.",
    icon: "chart",
    availableJobs: 860,
    featured: true,
    popular: true,
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Analytics dashboard displayed on a monitor",
    tone: "bg-emerald-50 text-accent ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900",
  },
  {
    id: "cat-product-design",
    name: "Design & Product",
    slug: "design-product",
    description:
      "Product design, UX research, product management, and design systems.",
    icon: "design",
    availableJobs: 540,
    featured: true,
    popular: true,
    imageUrl:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Design team reviewing interface mockups",
    tone: "bg-violet-50 text-violet-700 ring-violet-100 dark:bg-violet-950 dark:text-violet-200 dark:ring-violet-900",
  },
  {
    id: "cat-business",
    name: "Business Operations",
    slug: "business-operations",
    description:
      "Operations, strategy, project management, procurement, and admin roles.",
    icon: "briefcase",
    availableJobs: 720,
    popular: true,
    tone: "bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950 dark:text-sky-200 dark:ring-sky-900",
  },
  {
    id: "cat-customer",
    name: "Customer Success",
    slug: "customer-success",
    description:
      "Support, onboarding, retention, implementation, and account care teams.",
    icon: "support",
    availableJobs: 490,
    popular: true,
    tone: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900",
  },
  {
    id: "cat-marketing",
    name: "Marketing & Growth",
    slug: "marketing-growth",
    description:
      "Brand, content, lifecycle, SEO, performance marketing, and community.",
    icon: "megaphone",
    availableJobs: 430,
    popular: true,
    tone: "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-900",
  },
  {
    id: "cat-cybersecurity",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Security engineering, GRC, SOC analysis, identity, and cloud security.",
    icon: "shield",
    availableJobs: 310,
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-100 dark:bg-indigo-950 dark:text-indigo-200 dark:ring-indigo-900",
  },
  {
    id: "cat-education",
    name: "Education & Training",
    slug: "education-training",
    description:
      "Instructional design, academic operations, coaching, and learning roles.",
    icon: "book",
    availableJobs: 275,
    tone: "bg-cyan-50 text-cyan-700 ring-cyan-100 dark:bg-cyan-950 dark:text-cyan-200 dark:ring-cyan-900",
  },
  {
    id: "cat-healthcare",
    name: "Healthcare",
    slug: "healthcare",
    description:
      "Clinical operations, health technology, care coordination, and admin.",
    icon: "heart",
    availableJobs: 365,
    tone: "bg-red-50 text-red-700 ring-red-100 dark:bg-red-950 dark:text-red-200 dark:ring-red-900",
  },
  {
    id: "cat-finance",
    name: "Finance & Accounting",
    slug: "finance-accounting",
    description:
      "Accounting, audit, financial analysis, payroll, and fintech operations.",
    icon: "bank",
    availableJobs: 390,
    tone: "bg-lime-50 text-lime-700 ring-lime-100 dark:bg-lime-950 dark:text-lime-200 dark:ring-lime-900",
  },
  {
    id: "cat-cloud",
    name: "Cloud Infrastructure",
    slug: "cloud-infrastructure",
    description:
      "Cloud engineering, SRE, infrastructure automation, and systems roles.",
    icon: "cloud",
    availableJobs: 455,
    tone: "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-900",
  },
  {
    id: "cat-hr",
    name: "People & HR",
    slug: "people-hr",
    description:
      "Recruiting, HR operations, talent development, and workplace experience.",
    icon: "users",
    availableJobs: 225,
    tone: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100 dark:bg-fuchsia-950 dark:text-fuchsia-200 dark:ring-fuchsia-900",
  },
];

export const popularCategories = categories.filter((category) => category.popular);
export const featuredCategories = categories.filter(
  (category) => category.featured,
);
