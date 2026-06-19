export type PrivacySection = {
  id: string;
  title: string;
  lead?: string;
  paragraphs?: string[];
  items?: string[];
};

export type PrivacyContact = {
  title: string;
  description: string;
  email: string;
  href: string;
  responseTime: string;
};

export const privacyLastUpdated = "June 20, 2026";

export const privacyIntro = {
  eyebrow: "Privacy policy",
  title: "Privacy Policy",
  description:
    "This Privacy Policy explains how CareerBridge collects, uses, protects, and manages personal information for job seekers, employers, recruiters, and visitors. The content is static today and structured so it can later be supplied by static files, a CMS, or a backend API.",
};

export const privacyContact: PrivacyContact = {
  title: "Questions about your privacy?",
  description:
    "Contact CareerBridge support for privacy, account data, access, correction, or deletion requests.",
  email: "support@careerbridge.com",
  href: "mailto:support@careerbridge.com?subject=CareerBridge%20Privacy%20Request",
  responseTime: "Typical response: within one business day",
};

export const privacySections: PrivacySection[] = [
  {
    id: "introduction",
    title: "Introduction",
    lead:
      "CareerBridge respects your privacy and is committed to handling personal information responsibly.",
    paragraphs: [
      "This policy applies when you visit CareerBridge, create an account, build a profile, post or apply for jobs, communicate through the platform, or contact our support team.",
      "By using CareerBridge, you acknowledge that your information will be collected, used, stored, and shared as described in this policy and any feature-specific notices we provide.",
    ],
  },
  {
    id: "information-collection",
    title: "Information Collection",
    lead:
      "We collect information needed to operate a hiring and career platform, verify accounts, improve matching, and support users.",
    items: [
      "Account details such as name, email address, password credentials, account type, and communication preferences.",
      "Profile and application information such as resumes, skills, education, work history, portfolio links, expected salary, location, and job preferences.",
      "Employer and recruiter information such as company profiles, job posts, hiring contacts, billing details, and candidate evaluation activity.",
      "Usage and device information such as pages viewed, searches, clicks, IP address, browser type, approximate location, and security logs.",
      "Support communications and feedback submitted through forms, email, surveys, or platform messaging tools.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    lead:
      "CareerBridge uses collected information to provide services, personalize experiences, and keep the platform reliable.",
    items: [
      "Create and manage user accounts, profiles, job posts, applications, and platform messages.",
      "Match job seekers with relevant opportunities and help employers discover qualified candidates.",
      "Send account, security, support, product, and policy communications.",
      "Detect spam, fraud, abuse, unauthorized access, and violations of our Terms and Conditions.",
      "Analyze platform performance, improve product features, and develop new hiring and career tools.",
    ],
  },
  {
    id: "information-sharing",
    title: "Information Sharing",
    lead:
      "We share information only when needed to provide the service, comply with law, or protect users and CareerBridge.",
    paragraphs: [
      "Job seeker profiles and application materials may be shared with employers or recruiters when a user applies, expresses interest, or makes profile information visible for hiring purposes.",
      "Employer and job information may be shown to job seekers, partners, service providers, or public visitors depending on visibility settings and product functionality.",
    ],
    items: [
      "Trusted service providers that help with hosting, analytics, communication, security, customer support, and payment operations.",
      "Legal, regulatory, or safety recipients when disclosure is required by law or needed to protect rights, users, or platform integrity.",
      "Successor organizations if CareerBridge is involved in a merger, acquisition, financing, restructuring, or similar business transaction.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    lead:
      "We use technical, organizational, and administrative safeguards to protect personal information.",
    paragraphs: [
      "CareerBridge applies access controls, secure authentication practices, monitoring, and reasonable data protection measures designed to reduce unauthorized access, misuse, loss, or disclosure.",
      "No online service can guarantee absolute security. Users should keep passwords confidential, use strong credentials, and notify us promptly if they suspect unauthorized account access.",
    ],
  },
  {
    id: "cookies-tracking",
    title: "Cookies & Tracking",
    lead:
      "CareerBridge may use cookies and similar technologies to remember preferences, understand usage, and improve platform performance.",
    items: [
      "Essential cookies support login sessions, security, account routing, and core platform functionality.",
      "Analytics technologies help us understand traffic patterns, search behavior, feature usage, and performance issues.",
      "Preference cookies may remember settings such as language, region, saved filters, or display preferences.",
      "You can manage many cookie settings through your browser. Blocking some cookies may affect platform functionality.",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    lead:
      "We keep personal information only as long as needed for service, legal, security, and operational purposes.",
    paragraphs: [
      "Retention periods vary based on account status, user activity, legal requirements, dispute resolution needs, security obligations, and whether the information is part of an active job post, application, message, or support case.",
      "When information is no longer needed, we take reasonable steps to delete, anonymize, or restrict it according to our retention practices.",
    ],
  },
  {
    id: "user-rights",
    title: "User Rights",
    lead:
      "Depending on your location and relationship with CareerBridge, you may have rights over your personal information.",
    items: [
      "Access or receive a copy of certain personal information we maintain about you.",
      "Correct inaccurate or incomplete account, profile, company, or application information.",
      "Request deletion or restriction of certain information, subject to legal, security, and operational limits.",
      "Object to or opt out of certain communications or processing activities where applicable.",
      "Contact us to ask questions or submit a privacy request through CareerBridge support.",
    ],
  },
  {
    id: "policy-updates",
    title: "Policy Updates",
    lead:
      "We may update this Privacy Policy as CareerBridge changes or as legal and operational requirements evolve.",
    paragraphs: [
      "When updates are material, we will take reasonable steps to notify users, such as changing the last updated date, showing an in-product notice, or sending an email.",
      "Continuing to use CareerBridge after an updated policy becomes effective means you acknowledge the revised policy.",
    ],
  },
];
