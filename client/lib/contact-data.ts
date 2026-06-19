export type InquiryType =
  | "general"
  | "job-seeker-support"
  | "employer-support"
  | "recruiter-partnership"
  | "technical-support"
  | "billing-payments";

export type InquiryOption = {
  label: string;
  value: InquiryType;
};

export type ContactSupportCard = {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  meta: string;
  tone: "blue" | "emerald" | "slate" | "amber";
};

export type ContactFAQItem = {
  question: string;
  answer: string;
};

export type OfficeLocation = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
};

export const inquiryTypeOptions: InquiryOption[] = [
  { label: "General Inquiry", value: "general" },
  { label: "Job Seeker Support", value: "job-seeker-support" },
  { label: "Employer Support", value: "employer-support" },
  { label: "Recruiter Partnership", value: "recruiter-partnership" },
  { label: "Technical Support", value: "technical-support" },
  { label: "Billing & Payments", value: "billing-payments" },
];

export const contactHeroStats = [
  { value: "24h", label: "Average response time" },
  { value: "4", label: "Dedicated support paths" },
  { value: "98%", label: "Resolved support requests" },
];

export const contactSupportCards: ContactSupportCard[] = [
  {
    title: "Contact support",
    description:
      "Get help with your CareerBridge account, job applications, company profile, or hiring workflow.",
    actionLabel: "Start a request",
    href: "#contact-form",
    meta: "Replies within one business day",
    tone: "blue",
  },
  {
    title: "Email support",
    description:
      "Send detailed questions, screenshots, or documents to the CareerBridge support team.",
    actionLabel: "support@careerbridge.com",
    href: "mailto:support@careerbridge.com",
    meta: "Best for account and technical issues",
    tone: "emerald",
  },
  {
    title: "Help Center",
    description:
      "Browse answers for profile setup, job alerts, employer tools, billing, and application tracking.",
    actionLabel: "Visit help center",
    href: "#faq",
    meta: "Guides and troubleshooting articles",
    tone: "slate",
  },
  {
    title: "Community links",
    description:
      "Follow platform updates, hiring insights, and community announcements across our channels.",
    actionLabel: "View community",
    href: "#community",
    meta: "LinkedIn, Facebook, and X",
    tone: "amber",
  },
];

export const communityLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Facebook", href: "https://www.facebook.com" },
  { label: "X", href: "https://x.com" },
];

export const contactFAQItems: ContactFAQItem[] = [
  {
    question: "How soon will CareerBridge respond?",
    answer:
      "Most messages receive a reply within one business day. Technical and billing requests may require extra review.",
  },
  {
    question: "Can employers request a product walkthrough?",
    answer:
      "Yes. Choose Employer Support or Recruiter Partnership in the form and our team will route the request.",
  },
  {
    question: "Where should job seekers report application issues?",
    answer:
      "Use Job Seeker Support and include the job title, company name, and any error message you saw.",
  },
  {
    question: "Is the form connected to support tickets yet?",
    answer:
      "Not yet. The page is structured so it can later connect to an API, email service, CRM, or ticketing system.",
  },
];

export const headquarters: OfficeLocation = {
  name: "CareerBridge Headquarters",
  address: "Level 8, Innovation Tower, Gulshan Avenue, Dhaka 1212",
  hours: "Sunday to Thursday, 9:00 AM - 6:00 PM",
  phone: "+880 1700 000 000",
  email: "hello@careerbridge.com",
};
