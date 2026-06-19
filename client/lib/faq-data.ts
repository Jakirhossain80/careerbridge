export const faqCategories = [
  "Job Seekers",
  "Employers",
  "Recruiters",
  "Account Management",
  "Applications",
  "General Platform Questions",
] as const;

export type FAQCategory = (typeof faqCategories)[number];

export type FAQItem = {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  displayOrder: number;
  featured: boolean;
};

export const faqItems: FAQItem[] = [
  {
    id: "job-seekers-profile-setup",
    category: "Job Seekers",
    question: "How do I create a strong CareerBridge profile?",
    answer:
      "Add your current role, preferred job types, skills, work experience, education, and a concise career summary. Complete profiles help employers understand your fit faster and improve future matching features.",
    displayOrder: 1,
    featured: true,
  },
  {
    id: "job-seekers-job-alerts",
    category: "Job Seekers",
    question: "Can I receive alerts for jobs that match my skills?",
    answer:
      "Yes. CareerBridge is structured around role, category, location, and work-mode preferences so job alerts can be connected to your saved criteria as the platform evolves.",
    displayOrder: 2,
    featured: false,
  },
  {
    id: "job-seekers-remote-jobs",
    category: "Job Seekers",
    question: "Where can I find remote or hybrid roles?",
    answer:
      "Use the Remote Jobs page or filter job listings by work mode. Each job card highlights whether the role is remote, hybrid, or on-site when that information is available.",
    displayOrder: 3,
    featured: false,
  },
  {
    id: "employers-post-job",
    category: "Employers",
    question: "How do employers post a job on CareerBridge?",
    answer:
      "Employers can create an account, complete company details, and submit job information including title, description, skills, location, salary range, and application instructions.",
    displayOrder: 4,
    featured: true,
  },
  {
    id: "employers-company-profile",
    category: "Employers",
    question: "Can we showcase our company culture?",
    answer:
      "Yes. Company profiles are designed to highlight overview details, open roles, workplace culture, benefits, location, and the type of talent your team wants to attract.",
    displayOrder: 5,
    featured: false,
  },
  {
    id: "employers-candidates",
    category: "Employers",
    question: "How does CareerBridge help us review candidates?",
    answer:
      "CareerBridge focuses on clearer role and candidate context. Candidate review workflows can later connect profile data, application history, and employer shortlisting tools.",
    displayOrder: 6,
    featured: false,
  },
  {
    id: "recruiters-partnerships",
    category: "Recruiters",
    question: "Can recruiting agencies use CareerBridge?",
    answer:
      "Recruiters can use CareerBridge to discover talent, manage hiring conversations, and represent employer opportunities when the correct partnership or account setup is in place.",
    displayOrder: 7,
    featured: false,
  },
  {
    id: "recruiters-multiple-clients",
    category: "Recruiters",
    question: "Can recruiters manage roles for multiple clients?",
    answer:
      "The FAQ data and support flow are prepared for recruiter-specific workflows. Multi-client role management can be connected later through backend permissions and organization settings.",
    displayOrder: 8,
    featured: false,
  },
  {
    id: "account-management-reset-password",
    category: "Account Management",
    question: "How do I reset my password?",
    answer:
      "Go to the forgot password page, enter the email address tied to your account, and follow the reset link sent to your inbox. Check spam or promotions folders if you do not see it.",
    displayOrder: 9,
    featured: true,
  },
  {
    id: "account-management-change-email",
    category: "Account Management",
    question: "Can I change my account email address?",
    answer:
      "Email changes should be handled carefully because they affect login and verification. Contact support if you need help updating the email address on an existing account.",
    displayOrder: 10,
    featured: false,
  },
  {
    id: "account-management-blocked",
    category: "Account Management",
    question: "Why is my account pending or blocked?",
    answer:
      "Accounts may be pending while details are reviewed or blocked when platform rules require action. The account status page will explain the next step when available.",
    displayOrder: 11,
    featured: false,
  },
  {
    id: "applications-track-status",
    category: "Applications",
    question: "Can I track the status of my job applications?",
    answer:
      "Application tracking is planned around clear statuses such as submitted, reviewed, shortlisted, and closed. Current job details should explain the application path for each role.",
    displayOrder: 12,
    featured: true,
  },
  {
    id: "applications-edit-after-submit",
    category: "Applications",
    question: "Can I edit an application after submitting it?",
    answer:
      "Some employers may allow updates while others may not. If a submitted application needs correction, contact support or follow the employer instructions listed on the job post.",
    displayOrder: 13,
    featured: false,
  },
  {
    id: "applications-no-response",
    category: "Applications",
    question: "What should I do if I do not hear back?",
    answer:
      "Hiring timelines vary by employer. Review the job post for timeline details, keep your profile current, and continue applying to relevant roles while the employer reviews applicants.",
    displayOrder: 14,
    featured: false,
  },
  {
    id: "general-platform-free",
    category: "General Platform Questions",
    question: "Is CareerBridge free for job seekers?",
    answer:
      "CareerBridge is designed to let job seekers browse opportunities and create profiles. Any future paid features should be clearly labeled before a user chooses them.",
    displayOrder: 15,
    featured: false,
  },
  {
    id: "general-platform-support",
    category: "General Platform Questions",
    question: "How do I contact CareerBridge support?",
    answer:
      "Use the contact page for account issues, job seeker support, employer help, recruiter partnerships, billing questions, and technical problems.",
    displayOrder: 16,
    featured: true,
  },
  {
    id: "general-platform-data",
    category: "General Platform Questions",
    question: "Will this FAQ content come from a CMS later?",
    answer:
      "Yes. FAQ items already use stable IDs, categories, display order, and featured flags so the static data can later be replaced by CMS or backend API content.",
    displayOrder: 17,
    featured: false,
  },
];
