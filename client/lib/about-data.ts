import type { Testimonial } from "@/lib/home-data";

export type AboutStat = {
  value: string;
  label: string;
  description: string;
};

export type CoreValue = {
  title: string;
  description: string;
};

export type PlatformAudience = {
  title: string;
  description: string;
  points: string[];
};

export type WhyChooseReason = {
  title: string;
  description: string;
};

export type AboutWorkStep = {
  title: string;
  description: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  initials: string;
};

export const aboutHeroHighlights = [
  "Verified opportunities",
  "Skills-first profiles",
  "Employer-ready shortlists",
];

export const careerBridgeIntro = {
  eyebrow: "About CareerBridge",
  title: "A modern hiring bridge for people and growing companies.",
  description:
    "CareerBridge connects job seekers with relevant opportunities and helps employers find candidates with the right skills, intent, and career context. The platform is built for practical hiring decisions, not noisy job boards.",
};

export const mission = {
  title: "Our mission",
  description:
    "To make career growth more accessible by helping people discover roles that fit their skills while giving employers clearer, more useful candidate signals.",
};

export const vision = {
  title: "Our vision",
  description:
    "To become the trusted career infrastructure where talent, companies, and opportunity meet through transparent, skills-based hiring.",
};

export const coreValues: CoreValue[] = [
  {
    title: "Clarity over noise",
    description:
      "We design job discovery and hiring workflows around useful context, clean requirements, and focused decisions.",
  },
  {
    title: "Skills-first opportunity",
    description:
      "We help candidates show what they can do and help employers evaluate practical strengths with less guesswork.",
  },
  {
    title: "Trust by default",
    description:
      "Verified companies, thoughtful profiles, and transparent job details create confidence on both sides of the marketplace.",
  },
  {
    title: "Career momentum",
    description:
      "Every feature should help people take the next informed step, from discovery to application to offer.",
  },
];

export const platformAudiences: PlatformAudience[] = [
  {
    title: "For job seekers",
    description:
      "Build a focused profile, find relevant roles, and apply with stronger context.",
    points: [
      "Search local, hybrid, and remote jobs",
      "Highlight skills, goals, and work preferences",
      "Compare roles with clear job and company details",
    ],
  },
  {
    title: "For employers",
    description:
      "Publish roles, reach active candidates, and review shortlists with practical signals.",
    points: [
      "Attract candidates who match role expectations",
      "Showcase company culture and open positions",
      "Move faster from applicant review to interview",
    ],
  },
];

export const aboutStats: AboutStat[] = [
  {
    value: "18K+",
    label: "Active jobs",
    description: "Fresh opportunities across key industries and work modes.",
  },
  {
    value: "4.8K+",
    label: "Partner companies",
    description: "Verified employers using CareerBridge to reach talent.",
  },
  {
    value: "35K+",
    label: "Career moves",
    description: "Candidates connected with meaningful next steps.",
  },
  {
    value: "92%",
    label: "Profile match rate",
    description: "Stronger discovery through skills and preference signals.",
  },
];

export const whyChooseReasons: WhyChooseReason[] = [
  {
    title: "Built for both sides of hiring",
    description:
      "Candidates get a cleaner search experience while employers get profiles that are easier to assess.",
  },
  {
    title: "Focused on verified opportunities",
    description:
      "CareerBridge keeps job details, company context, and work expectations visible before people apply.",
  },
  {
    title: "Designed for modern work",
    description:
      "Remote, hybrid, and on-site roles are organized around how teams actually hire and collaborate.",
  },
];

export const aboutWorkSteps: AboutWorkStep[] = [
  {
    title: "Create a clear profile",
    description:
      "Job seekers add skills, experience, goals, and work preferences that employers can quickly understand.",
  },
  {
    title: "Find or publish the right role",
    description:
      "Candidates discover matched jobs while employers post openings with practical requirements and context.",
  },
  {
    title: "Connect with confidence",
    description:
      "Applications and shortlists move forward with better alignment between candidate strengths and company needs.",
  },
];

export const aboutTeam: TeamMember[] = [
  {
    name: "Nadia Rahman",
    role: "Product Strategy",
    bio: "Shapes candidate and employer workflows around practical hiring needs.",
    initials: "NR",
  },
  {
    name: "Tanvir Hasan",
    role: "Talent Operations",
    bio: "Works with companies to improve job quality and shortlist clarity.",
    initials: "TH",
  },
  {
    name: "Ayesha Karim",
    role: "Career Experience",
    bio: "Designs guidance that helps job seekers move with more confidence.",
    initials: "AK",
  },
];

export const aboutTestimonials: Testimonial[] = [
  {
    name: "Farhan Ahmed",
    role: "Software Engineer",
    quote:
      "CareerBridge made my search feel structured. I could see which roles matched my skills before applying.",
    initials: "FA",
  },
  {
    name: "Maliha Chowdhury",
    role: "People Lead at GrowthPilot",
    quote:
      "The profiles are concise and useful. Our hiring team spent less time filtering and more time interviewing.",
    initials: "MC",
  },
  {
    name: "Rafi Islam",
    role: "Product Designer",
    quote:
      "The platform helped me compare company expectations clearly and focus on roles where I had a strong fit.",
    initials: "RI",
  },
];
