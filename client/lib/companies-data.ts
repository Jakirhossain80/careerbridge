export type Company = {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  employees: string;
  openJobs: number;
  rating: number;
  founded: string;
  workModes: string[];
  tags: string[];
  verified: boolean;
  featured?: boolean;
  initials: string;
  logoTone: string;
  href: string;
};

export type FilterGroup = {
  title: string;
  options: Array<{
    label: string;
    count: number;
    checked?: boolean;
  }>;
};

export const companies: Company[] = [
  {
    id: "brightpath-labs",
    name: "BrightPath Labs",
    industry: "Software & Cloud",
    location: "Dhaka, Bangladesh",
    description:
      "Builds cloud platforms, workflow tools, and customer-facing products for fast-growing regional businesses.",
    employees: "201-500",
    openJobs: 24,
    rating: 4.9,
    founded: "2018",
    workModes: ["Hybrid", "Remote"],
    tags: ["React", "Cloud", "Product"],
    verified: true,
    featured: true,
    initials: "BL",
    logoTone: "bg-blue-50 text-primary ring-blue-100",
    href: "/companies/brightpath-labs",
  },
  {
    id: "nexaworks",
    name: "NexaWorks",
    industry: "Product & Design",
    location: "Remote-first",
    description:
      "A distributed product studio helping SaaS teams research, design, and ship polished digital experiences.",
    employees: "51-200",
    openJobs: 18,
    rating: 4.8,
    founded: "2020",
    workModes: ["Remote"],
    tags: ["UX", "SaaS", "Design"],
    verified: true,
    featured: true,
    initials: "NW",
    logoTone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    href: "/companies/nexaworks",
  },
  {
    id: "careermetric",
    name: "CareerMetric",
    industry: "Data Intelligence",
    location: "Chattogram, Bangladesh",
    description:
      "Turns workforce, hiring, and business data into dashboards that help teams make sharper decisions.",
    employees: "101-200",
    openJobs: 16,
    rating: 4.7,
    founded: "2017",
    workModes: ["On-site", "Hybrid"],
    tags: ["Analytics", "BI", "Python"],
    verified: true,
    initials: "CM",
    logoTone: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    href: "/companies/careermetric",
  },
  {
    id: "skillforge",
    name: "SkillForge",
    industry: "EdTech",
    location: "Sylhet, Bangladesh",
    description:
      "Creates practical learning programs, mentorship tracks, and hiring pipelines for early-career talent.",
    employees: "51-200",
    openJobs: 12,
    rating: 4.6,
    founded: "2019",
    workModes: ["Hybrid"],
    tags: ["Learning", "Mentorship", "Ops"],
    verified: true,
    initials: "SF",
    logoTone: "bg-violet-50 text-violet-700 ring-violet-100",
    href: "/companies/skillforge",
  },
  {
    id: "growthpilot",
    name: "GrowthPilot",
    industry: "Marketing & Growth",
    location: "Dhaka, Bangladesh",
    description:
      "Runs acquisition, lifecycle, and analytics programs for consumer brands scaling across South Asia.",
    employees: "51-200",
    openJobs: 9,
    rating: 4.5,
    founded: "2021",
    workModes: ["On-site", "Hybrid"],
    tags: ["Campaigns", "Content", "CRM"],
    verified: true,
    initials: "GP",
    logoTone: "bg-amber-50 text-amber-700 ring-amber-100",
    href: "/companies/growthpilot",
  },
  {
    id: "greenledger",
    name: "GreenLedger",
    industry: "FinTech",
    location: "Rajshahi, Bangladesh",
    description:
      "Develops finance, payments, and reporting products for SMEs that need simple and reliable operations.",
    employees: "201-500",
    openJobs: 14,
    rating: 4.7,
    founded: "2016",
    workModes: ["Hybrid"],
    tags: ["Finance", "Security", "APIs"],
    verified: true,
    initials: "GL",
    logoTone: "bg-lime-50 text-lime-700 ring-lime-100",
    href: "/companies/greenledger",
  },
];

export const companyFilterGroups: FilterGroup[] = [
  {
    title: "Industry",
    options: [
      { label: "Software & Cloud", count: 124, checked: true },
      { label: "Product & Design", count: 86 },
      { label: "Data Intelligence", count: 74 },
      { label: "FinTech", count: 58 },
      { label: "EdTech", count: 41 },
    ],
  },
  {
    title: "Company size",
    options: [
      { label: "1-50 employees", count: 96 },
      { label: "51-200 employees", count: 148, checked: true },
      { label: "201-500 employees", count: 103 },
      { label: "500+ employees", count: 72 },
    ],
  },
  {
    title: "Work mode",
    options: [
      { label: "Remote", count: 119, checked: true },
      { label: "Hybrid", count: 162 },
      { label: "On-site", count: 88 },
    ],
  },
];

export const companiesOfMonth = companies.filter((company) => company.featured);
