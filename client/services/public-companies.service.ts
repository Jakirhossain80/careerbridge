import {
  type CompanyDetails,
  type CompanySocialLink,
} from "@/lib/company-details-data";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

type PublicCompanyApiResponse = {
  _id: string;
  name: string;
  companyName?: string;
  slug?: string;
  logo?: string;
  logoUrl?: string;
  banner?: string;
  bannerUrl?: string;
  tagline?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  companySize?: string;
  location?: string;
  headquarters?: string;
  socialLinks?: Record<string, string>;
};

function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (configuredUrl && !configuredUrl.startsWith("/")) {
    return configuredUrl;
  }

  return "http://localhost:5000/api/v1";
}

function toWebsiteLabel(website: string) {
  return website.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function getInitials(companyName: string) {
  const words = companyName.trim().split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]).join("");

  return (initials || companyName.slice(0, 2)).toUpperCase();
}

function mapSocialLinks(
  socialLinks?: Record<string, string>,
): CompanySocialLink[] {
  if (!socialLinks) {
    return [];
  }

  return Object.entries(socialLinks)
    .filter(([, href]) => Boolean(href))
    .map(([label, href]) => ({ label, href }));
}

function unwrap<T>(payload: ApiEnvelope<T> | T) {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }

  return payload as T;
}

function normalizePublicCompany(
  company: PublicCompanyApiResponse,
): CompanyDetails {
  const name = company.companyName ?? company.name;
  const website = company.website ?? "";
  const industry = company.industry ?? "";
  const headquarters =
    company.headquarters ?? company.location ?? "";
  const companySize = company.companySize ?? company.size ?? "";
  const description = company.description?.trim();
  const tagline =
    company.tagline?.trim() ||
    description?.split(".").find((sentence) => sentence.trim())?.trim() ||
    "Company tagline not available";
  const about = description
    ? description
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  return {
    id: company._id,
    name,
    tagline,
    industry,
    companySize,
    headquarters,
    website,
    founded: "Not provided",
    followers: "Not available",
    openPositionsCount: 0,
    initials: getInitials(name),
    logoUrl: company.logoUrl ?? company.logo,
    bannerUrl: company.bannerUrl ?? company.banner,
    logoTone: "bg-blue-50 text-primary ring-blue-100",
    coverTone:
      "from-blue-950 via-blue-700 to-emerald-500 dark:from-slate-950 dark:via-blue-950 dark:to-emerald-700",
    about,
    information: [
      {
        label: "Website",
        value: website ? toWebsiteLabel(website) : "Not provided",
        href: website || undefined,
      },
      {
        label: "Industry",
        value: industry || "Not provided",
      },
      {
        label: "Headquarters",
        value: headquarters || "Not provided",
      },
    ],
    socialLinks: mapSocialLinks(company.socialLinks),
    talentPool: {
      eyebrow: "Talent pool",
      title: `Interested in ${name}?`,
      description:
        "Join the company talent pool to get matched when new roles open.",
      href: `/jobs?companyId=${company._id}`,
    },
    positions: [],
  };
}

export async function getPublicCompanyDetails(id: string) {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}/companies/${id}`, {
      next: { revalidate: 60 },
    });
  } catch {
    return null;
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as
    | ApiEnvelope<PublicCompanyApiResponse>
    | PublicCompanyApiResponse;
  const company = unwrap<PublicCompanyApiResponse>(payload);

  return normalizePublicCompany(company);
}
