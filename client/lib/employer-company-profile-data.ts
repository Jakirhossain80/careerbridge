export type SocialLink = {
  label: string;
  href: string;
};

export type CompanyHighlight = {
  id: string;
  title: string;
  description: string;
  date: string;
};

export type CompanyProfile = {
  id: string;
  companyName: string;
  slug: string;
  logoUrl: string;
  bannerUrl: string;
  tagline: string;
  about: string;
  industry: string;
  companySize: string;
  website: string;
  headquarters: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialLinks: SocialLink[];
  openRolesCount: number;
  verified: boolean;
  hiringStatus: "Actively hiring" | "Hiring selectively" | "Not hiring";
  profileCompletionPercentage: number;
  highlights: CompanyHighlight[];
  benefits: string[];
  culture: string[];
};

export const employerCompanyProfile: CompanyProfile = {
  id: "brightpath-labs",
  companyName: "BrightPath Labs",
  slug: "brightpath-labs",
  logoUrl: "/company-assets/brightpath-logo.svg",
  bannerUrl: "/company-assets/brightpath-banner.svg",
  tagline:
    "Building cloud workflow tools and customer experience products for fast-growing teams.",
  about:
    "BrightPath Labs builds reliable SaaS platforms for companies that need practical, accessible, and measurable software. Our product, engineering, design, and customer teams work in focused squads to simplify complex workflows and ship features that make daily operations easier.",
  industry: "Software & Cloud",
  companySize: "201-500 employees",
  website: "https://brightpath.example.com",
  headquarters: "Dhaka, Bangladesh",
  contactEmail: "hiring@brightpath.example.com",
  phone: "+880 1712-345678",
  address: "House 42, Road 12, Banani, Dhaka 1213, Bangladesh",
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "Facebook", href: "https://www.facebook.com" },
  ],
  openRolesCount: 24,
  verified: true,
  hiringStatus: "Actively hiring",
  profileCompletionPercentage: 92,
  highlights: [
    {
      id: "highlight-product-launch",
      title: "Launched a new workflow automation suite",
      description:
        "Released an automation toolkit that helps operations teams reduce repetitive approval work.",
      date: "Jun 2026",
    },
    {
      id: "highlight-hiring",
      title: "Expanded product and engineering teams",
      description:
        "Opened roles across frontend engineering, product design, platform, and customer success.",
      date: "May 2026",
    },
    {
      id: "highlight-certification",
      title: "Completed annual security review",
      description:
        "Renewed internal security controls and customer data handling standards for enterprise clients.",
      date: "Apr 2026",
    },
  ],
  benefits: [
    "Hybrid work flexibility",
    "Learning and certification budget",
    "Private health coverage",
    "Paid parental leave",
  ],
  culture: [
    "Small autonomous product squads",
    "Accessible and inclusive design practices",
    "Clear written decision records",
    "Monthly customer feedback reviews",
  ],
};
