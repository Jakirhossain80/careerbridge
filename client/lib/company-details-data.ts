export type CompanySocialLink = {
  label: string;
  href: string;
};

export type CompanyInfoItem = {
  label: string;
  value: string;
  href?: string;
};

export type CompanyOpenPosition = {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: string;
  workMode: string;
  salary: string;
  postedAt: string;
  applicants: number;
  skills: string[];
  href: string;
  featured?: boolean;
};

export type CompanyDetails = {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  companySize: string;
  headquarters: string;
  website: string;
  founded: string;
  followers: string;
  openPositionsCount: number;
  initials: string;
  logoTone: string;
  coverTone: string;
  about: string[];
  information: CompanyInfoItem[];
  socialLinks: CompanySocialLink[];
  talentPool: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  };
  positions: CompanyOpenPosition[];
};

export const companyDetails: CompanyDetails[] = [
  {
    id: "brightpath-labs",
    name: "BrightPath Labs",
    tagline:
      "Customer experience products, cloud workflows, and practical SaaS platforms for fast-growing teams.",
    industry: "Software & Cloud",
    companySize: "201-500 employees",
    headquarters: "Dhaka, Bangladesh",
    website: "https://brightpath.example.com",
    founded: "2018",
    followers: "18.4K",
    openPositionsCount: 24,
    initials: "BL",
    logoTone: "bg-blue-50 text-primary ring-blue-100",
    coverTone:
      "from-blue-950 via-blue-700 to-emerald-500 dark:from-slate-950 dark:via-blue-950 dark:to-emerald-700",
    about: [
      "BrightPath Labs builds cloud platforms, workflow tools, and customer-facing products for fast-growing regional businesses. The team partners closely with product and operations leaders to turn complex internal workflows into clear, reliable software.",
      "Engineers, designers, and customer teams work in small squads with a strong focus on accessible interfaces, measurable outcomes, and pragmatic delivery. BrightPath is actively hiring people who enjoy ownership, thoughtful collaboration, and building products used every day.",
    ],
    information: [
      {
        label: "Website",
        value: "brightpath.example.com",
        href: "https://brightpath.example.com",
      },
      {
        label: "Industry",
        value: "Software & Cloud",
      },
      {
        label: "Headquarters",
        value: "Dhaka, Bangladesh",
      },
    ],
    socialLinks: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com",
      },
      {
        label: "X",
        href: "https://x.com",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com",
      },
    ],
    talentPool: {
      eyebrow: "Talent pool",
      title: "Interested in BrightPath Labs?",
      description:
        "Join the company talent pool to get matched when new engineering, product, and operations roles open.",
      href: "/jobs?company=brightpath-labs",
    },
    positions: [
      {
        id: "frontend-engineer-react",
        title: "Frontend Engineer, React",
        department: "Engineering",
        location: "Dhaka, Bangladesh",
        jobType: "Full-time",
        workMode: "Hybrid",
        salary: "$70K - $98K",
        postedAt: "1 day ago",
        applicants: 86,
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        href: "/jobs/frontend-engineer-react",
        featured: true,
      },
      {
        id: "product-operations-manager",
        title: "Product Operations Manager",
        department: "Operations",
        location: "Dhaka, Bangladesh",
        jobType: "Full-time",
        workMode: "Hybrid",
        salary: "$58K - $78K",
        postedAt: "3 days ago",
        applicants: 51,
        skills: ["Product Ops", "Analytics", "SaaS", "Stakeholders"],
        href: "/jobs/product-operations-manager",
      },
      {
        id: "cloud-platform-engineer",
        title: "Cloud Platform Engineer",
        department: "Infrastructure",
        location: "Remote",
        jobType: "Full-time",
        workMode: "Remote",
        salary: "$88K - $118K",
        postedAt: "5 days ago",
        applicants: 64,
        skills: ["AWS", "Node.js", "Observability", "APIs"],
        href: "/jobs/cloud-platform-engineer",
      },
    ],
  },
];

export const getCompanyDetailsById = (id: string) =>
  companyDetails.find((company) => company.id === id);
