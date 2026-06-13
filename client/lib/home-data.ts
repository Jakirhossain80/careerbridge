import type { CompanyCardProps, JobCardProps } from "@/components/cards";

export type Category = {
  title: string;
  description: string;
  openRoles: string;
  icon: "code" | "chart" | "briefcase" | "design" | "support" | "megaphone";
};

export type HomeStat = {
  value: string;
  label: string;
  description: string;
};

export type WorkStep = {
  title: string;
  description: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initials: string;
};

export type BlogArticle = {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  href: string;
};

export const categories: Category[] = [
  {
    title: "Software Development",
    description: "Frontend, backend, mobile, and platform roles.",
    openRoles: "1,240 jobs",
    icon: "code",
  },
  {
    title: "Data & Analytics",
    description: "BI, data science, analytics, and research teams.",
    openRoles: "860 jobs",
    icon: "chart",
  },
  {
    title: "Business Operations",
    description: "Strategy, project management, and operations roles.",
    openRoles: "720 jobs",
    icon: "briefcase",
  },
  {
    title: "Design & Product",
    description: "Product design, UX research, and product management.",
    openRoles: "540 jobs",
    icon: "design",
  },
  {
    title: "Customer Success",
    description: "Support, onboarding, retention, and account care.",
    openRoles: "490 jobs",
    icon: "support",
  },
  {
    title: "Marketing & Growth",
    description: "Content, lifecycle, brand, and acquisition roles.",
    openRoles: "430 jobs",
    icon: "megaphone",
  },
];

export const featuredJobs: JobCardProps[] = [
  {
    id: "job-1",
    title: "Frontend Engineer",
    companyName: "BrightPath Labs",
    location: "Dhaka, Bangladesh",
    jobType: "Full-time",
    workMode: "Hybrid",
    salary: "$2,000 - $3,200 / month",
    skills: ["React", "TypeScript", "Tailwind"],
    postedAt: "2 days ago",
    featured: true,
    href: "/jobs/frontend-engineer",
  },
  {
    id: "job-2",
    title: "Product Designer",
    companyName: "NexaWorks",
    location: "Remote",
    jobType: "Contract",
    workMode: "Remote",
    salary: "$35 - $55 / hour",
    skills: ["Figma", "UX Research", "Design Systems"],
    postedAt: "Today",
    featured: true,
    href: "/jobs/product-designer",
  },
  {
    id: "job-3",
    title: "Data Analyst",
    companyName: "CareerMetric",
    location: "Chattogram, Bangladesh",
    jobType: "Full-time",
    workMode: "On-site",
    salary: "$1,400 - $2,100 / month",
    skills: ["SQL", "Power BI", "Python"],
    postedAt: "4 days ago",
    featured: true,
    href: "/jobs/data-analyst",
  },
];

export const topCompanies: CompanyCardProps[] = [
  {
    id: "company-1",
    name: "BrightPath Labs",
    industry: "Software & Cloud",
    location: "Dhaka, Bangladesh",
    openJobs: 24,
    verified: true,
    href: "/companies/brightpath-labs",
  },
  {
    id: "company-2",
    name: "NexaWorks",
    industry: "Product & Design",
    location: "Remote-first",
    openJobs: 18,
    verified: true,
    href: "/companies/nexaworks",
  },
  {
    id: "company-3",
    name: "CareerMetric",
    industry: "Data Intelligence",
    location: "Chattogram, Bangladesh",
    openJobs: 16,
    verified: true,
    href: "/companies/careermetric",
  },
  {
    id: "company-4",
    name: "SkillForge",
    industry: "EdTech",
    location: "Sylhet, Bangladesh",
    openJobs: 12,
    verified: true,
    href: "/companies/skillforge",
  },
];

export const remoteJobs: JobCardProps[] = [
  {
    id: "remote-job-1",
    title: "Remote React Developer",
    companyName: "NexaWorks",
    location: "Remote",
    jobType: "Full-time",
    workMode: "Remote",
    salary: "$2,400 - $3,800 / month",
    skills: ["React", "Next.js", "TypeScript"],
    postedAt: "Today",
    href: "/jobs/remote-react-developer",
  },
  {
    id: "remote-job-2",
    title: "Customer Success Specialist",
    companyName: "SkillForge",
    location: "Remote",
    jobType: "Full-time",
    workMode: "Remote",
    salary: "$1,200 - $1,900 / month",
    skills: ["Onboarding", "CRM", "Communication"],
    postedAt: "1 day ago",
    href: "/jobs/customer-success-specialist",
  },
];

export const latestJobs: JobCardProps[] = [
  {
    id: "latest-job-1",
    title: "Junior Backend Engineer",
    companyName: "BrightPath Labs",
    location: "Dhaka, Bangladesh",
    jobType: "Full-time",
    workMode: "Hybrid",
    salary: "$1,300 - $2,000 / month",
    skills: ["Node.js", "PostgreSQL", "APIs"],
    postedAt: "2 hours ago",
    href: "/jobs/junior-backend-engineer",
  },
  {
    id: "latest-job-2",
    title: "Marketing Coordinator",
    companyName: "GrowthPilot",
    location: "Dhaka, Bangladesh",
    jobType: "Full-time",
    workMode: "On-site",
    salary: "$900 - $1,400 / month",
    skills: ["Content", "Campaigns", "Analytics"],
    postedAt: "5 hours ago",
    href: "/jobs/marketing-coordinator",
  },
  {
    id: "latest-job-3",
    title: "UX Research Assistant",
    companyName: "NexaWorks",
    location: "Remote",
    jobType: "Part-time",
    workMode: "Remote",
    salary: "$18 - $28 / hour",
    skills: ["Interviews", "Research", "Synthesis"],
    postedAt: "Yesterday",
    href: "/jobs/ux-research-assistant",
  },
];

export const homeStats: HomeStat[] = [
  {
    value: "18K+",
    label: "Active jobs",
    description: "Fresh roles from verified employers.",
  },
  {
    value: "4.8K+",
    label: "Partner companies",
    description: "Growing teams across key industries.",
  },
  {
    value: "92%",
    label: "Profile match rate",
    description: "Better shortlists with skill-based matching.",
  },
  {
    value: "35K+",
    label: "Career moves",
    description: "Candidates connected to meaningful work.",
  },
];

export const workSteps: WorkStep[] = [
  {
    title: "Create your profile",
    description: "Showcase skills, experience, career goals, and preferred work style.",
  },
  {
    title: "Discover matched roles",
    description: "Search jobs and browse curated opportunities aligned with your path.",
  },
  {
    title: "Apply with confidence",
    description: "Use a focused profile and clear job details to make stronger applications.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Nadia Rahman",
    role: "Frontend Engineer at BrightPath Labs",
    quote:
      "CareerBridge helped me focus on roles that matched my skills instead of sending applications everywhere.",
    initials: "NR",
  },
  {
    name: "Tanvir Hasan",
    role: "Hiring Manager at NexaWorks",
    quote:
      "The candidate profiles are clear, practical, and easy to compare. It made our shortlist much faster.",
    initials: "TH",
  },
  {
    name: "Ayesha Karim",
    role: "Data Analyst at CareerMetric",
    quote:
      "The job details and skill tags made it easier to understand where I had a real chance before applying.",
    initials: "AK",
  },
];

export const blogArticles: BlogArticle[] = [
  {
    title: "How to read a job post before you apply",
    excerpt:
      "Learn how to spot must-have skills, nice-to-have signals, and role expectations before sending your application.",
    category: "Job Search",
    readTime: "5 min read",
    publishedAt: "Career Guide",
    href: "/blog/how-to-read-a-job-post",
  },
  {
    title: "Building a skills-first profile employers can scan",
    excerpt:
      "A practical profile structure that helps hiring teams understand your strengths quickly.",
    category: "Profile Tips",
    readTime: "7 min read",
    publishedAt: "Candidate Toolkit",
    href: "/blog/skills-first-profile",
  },
  {
    title: "Remote hiring signals that make candidates stand out",
    excerpt:
      "Show collaboration habits, communication clarity, and ownership when applying for remote roles.",
    category: "Remote Work",
    readTime: "6 min read",
    publishedAt: "Hiring Insights",
    href: "/blog/remote-hiring-signals",
  },
];
