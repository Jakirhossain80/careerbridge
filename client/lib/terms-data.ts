export type TermsSection = {
  id: string;
  title: string;
  lead?: string;
  paragraphs?: string[];
  items?: string[];
};

export type TermsContact = {
  title: string;
  description: string;
  email: string;
  href: string;
  responseTime: string;
};

export const termsLastUpdated = "June 19, 2026";

export const termsIntro = {
  eyebrow: "Legal terms",
  title: "Terms and Conditions",
  description:
    "These Terms explain the rules for using CareerBridge as a job seeker, employer, recruiter, or visitor. The content is static today and structured so it can later be supplied by static files, a CMS, or a backend API.",
};

export const termsContact: TermsContact = {
  title: "Need help understanding these terms?",
  description:
    "Contact CareerBridge support for account, platform, or legal-policy questions before continuing to use the service.",
  email: "support@careerbridge.com",
  href: "mailto:support@careerbridge.com",
  responseTime: "Typical response: within one business day",
};

export const termsSections: TermsSection[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    lead:
      "By accessing or using CareerBridge, you agree to be bound by these Terms and any policies referenced in them.",
    paragraphs: [
      "If you use CareerBridge on behalf of a company, recruiting agency, educational institution, or other organization, you represent that you have authority to accept these Terms for that organization.",
      "If you do not agree with these Terms, you should not create an account, post jobs, apply for jobs, contact candidates, or otherwise use CareerBridge services.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    lead:
      "CareerBridge is intended for people and organizations that can enter into legally binding agreements.",
    items: [
      "You must provide accurate registration information and keep your account details current.",
      "Job seekers must be legally eligible to pursue the roles they apply for.",
      "Employers and recruiters must be authorized to represent the opportunities, organizations, or clients they post for.",
    ],
  },
  {
    id: "user-responsibilities",
    title: "User Responsibilities",
    lead:
      "All users are responsible for using CareerBridge honestly, lawfully, and in a way that protects other users.",
    items: [
      "Keep login credentials confidential and notify us if you suspect unauthorized access.",
      "Submit truthful profile, application, company, and job information.",
      "Respect other users and avoid discriminatory, misleading, abusive, or harassing conduct.",
      "Use platform communication tools only for legitimate hiring and career-related purposes.",
    ],
  },
  {
    id: "job-seeker-responsibilities",
    title: "Job Seeker Responsibilities",
    lead:
      "Job seekers are responsible for the information they share with employers, recruiters, and CareerBridge.",
    items: [
      "Keep resumes, profiles, portfolios, and application materials accurate and up to date.",
      "Apply only for roles you are genuinely interested in and qualified to pursue.",
      "Do not impersonate another person or submit information you do not have permission to use.",
      "Review employer communications carefully before sharing sensitive personal information outside CareerBridge.",
    ],
  },
  {
    id: "employer-recruiter-responsibilities",
    title: "Employer / Recruiter Responsibilities",
    lead:
      "Employers and recruiters must use CareerBridge in a fair, transparent, and compliant hiring manner.",
    items: [
      "Post only real job opportunities with accurate titles, requirements, locations, compensation details, and application expectations.",
      "Represent your company, client, or hiring authority truthfully.",
      "Evaluate candidates in compliance with applicable employment, anti-discrimination, privacy, and labor laws.",
      "Do not request unlawful fees, sensitive personal details, or financial information from job seekers through job posts or messages.",
    ],
  },
  {
    id: "prohibited-activities",
    title: "Prohibited Activities",
    lead:
      "The following activities are not allowed on CareerBridge and may result in account restrictions or removal.",
    items: [
      "Posting fake, fraudulent, misleading, discriminatory, or unlawful content.",
      "Scraping, harvesting, selling, or misusing user data without permission.",
      "Attempting to bypass security controls, rate limits, account review, or moderation systems.",
      "Uploading malware, spam, phishing content, or content that infringes another party's rights.",
      "Using CareerBridge to promote unrelated products, pyramid schemes, or non-hiring solicitations.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    lead:
      "CareerBridge and its platform content, branding, interfaces, and technology are protected by intellectual property laws.",
    paragraphs: [
      "You retain ownership of content you submit, such as resumes, profiles, company descriptions, job posts, and messages. You grant CareerBridge a limited license to host, process, display, and share that content as needed to operate the service.",
      "You may not copy, modify, distribute, reverse engineer, or create derivative works from CareerBridge technology or brand assets unless we give written permission.",
    ],
  },
  {
    id: "privacy-policy-reference",
    title: "Privacy Policy Reference",
    lead:
      "Your use of CareerBridge is also governed by our Privacy Policy and related privacy notices.",
    paragraphs: [
      "The Privacy Policy explains how CareerBridge collects, uses, stores, and shares personal information. By using the platform, you acknowledge that your information will be handled according to that policy.",
      "If a separate privacy notice or consent flow applies to a feature, that notice will control for the specific feature it describes.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    lead:
      "CareerBridge may suspend or terminate access when needed to protect users, the platform, or legal compliance.",
    paragraphs: [
      "We may restrict, suspend, or close accounts that violate these Terms, create risk, contain inaccurate information, or are inactive for an extended period.",
      "You may stop using CareerBridge at any time. Some information may remain available where needed for legal, security, fraud-prevention, or recordkeeping purposes.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    lead:
      "CareerBridge provides a hiring and career platform, but we do not guarantee employment outcomes, candidate availability, or hiring results.",
    paragraphs: [
      "To the fullest extent permitted by law, CareerBridge is not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, lost data, lost opportunities, or business interruption.",
      "Users are responsible for verifying job opportunities, candidate details, hiring decisions, and any off-platform communications or agreements.",
    ],
  },
  {
    id: "changes-to-terms",
    title: "Changes to Terms",
    lead:
      "CareerBridge may update these Terms to reflect product changes, legal requirements, or operating practices.",
    paragraphs: [
      "When changes are material, we will take reasonable steps to notify users, such as updating the last updated date, showing an in-product notice, or sending an email.",
      "Continuing to use CareerBridge after updated Terms become effective means you accept the revised Terms.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law",
    lead:
      "These Terms are governed by the laws applicable to CareerBridge's operating jurisdiction, without regard to conflict-of-law rules.",
    paragraphs: [
      "Any dispute related to these Terms or your use of CareerBridge should first be raised with CareerBridge support so the parties can attempt to resolve it informally.",
      "Where informal resolution is not possible, disputes will be handled in the courts or forums with proper jurisdiction, unless another written agreement applies.",
    ],
  },
  {
    id: "contact-information",
    title: "Contact Information",
    lead:
      "Questions about these Terms, account status, or platform policies can be sent to CareerBridge support.",
    items: [
      "Email: support@careerbridge.com",
      "Address: Level 8, Innovation Tower, Gulshan Avenue, Dhaka 1212",
      "Support hours: Sunday to Thursday, 9:00 AM - 6:00 PM",
    ],
  },
];
