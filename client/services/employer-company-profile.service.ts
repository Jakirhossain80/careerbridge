"use client";

import { api } from "@/lib/api";
import {
  employerCompanyProfile,
  type CompanyProfile,
  type SocialLink,
} from "@/lib/employer-company-profile-data";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

type EmployerCompanyApiResponse = {
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
  ownerEmail?: string;
  socialLinks?: Record<string, string> | Map<string, string>;
  status?: string;
  verificationStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type EmployerCompanyProfileUpdatePayload = {
  companyName: string;
  website?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
};

export type EmployerCompanyProfileCreatePayload =
  EmployerCompanyProfileUpdatePayload;

export const employerCompanyProfileQueryKeys = {
  all: ["employer-company-profile"] as const,
  detail: ["employer-company-profile", "me"] as const,
  dashboard: ["employer-dashboard"] as const,
};

function unwrap<T>(response: { data: ApiEnvelope<T> | T }) {
  const payload = response.data;

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

function mapSocialLinks(
  socialLinks?: Record<string, string> | Map<string, string>,
): SocialLink[] {
  if (!socialLinks) {
    return [];
  }

  const entries =
    socialLinks instanceof Map
      ? Array.from(socialLinks.entries())
      : Object.entries(socialLinks);

  return entries
    .filter(([, href]) => Boolean(href))
    .map(([label, href]) => ({ label, href }));
}

function calculateProfileCompletion(company: EmployerCompanyApiResponse) {
  const checks = [
    company.companyName ?? company.name,
    company.website,
    company.industry,
    company.companySize ?? company.size,
    company.headquarters ?? company.location,
    company.description,
    company.logoUrl ?? company.logo,
    company.bannerUrl ?? company.banner,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function normalizeEmployerCompanyProfile(
  company: EmployerCompanyApiResponse,
): CompanyProfile {
  const companyName = company.companyName ?? company.name;
  const about = company.description ?? "";
  const fallbackTagline =
    company.tagline?.trim() ||
    about.split(".").find((sentence) => sentence.trim())?.trim() ||
    `${companyName} is building its CareerBridge profile.`;
  const verificationStatus = company.verificationStatus ?? company.status;

  return {
    ...employerCompanyProfile,
    id: company._id,
    companyName,
    slug: company.slug ?? company._id,
    logoUrl: company.logoUrl ?? company.logo ?? "",
    bannerUrl: company.bannerUrl ?? company.banner ?? "",
    tagline: fallbackTagline,
    about,
    industry: company.industry ?? "",
    companySize: company.companySize ?? company.size ?? "",
    website: company.website ?? "",
    headquarters: company.headquarters ?? company.location ?? "",
    contactEmail: company.ownerEmail ?? "",
    address: company.headquarters ?? company.location ?? "",
    socialLinks: mapSocialLinks(company.socialLinks),
    verified: verificationStatus === "approved",
    profileCompletionPercentage: calculateProfileCompletion(company),
  };
}

export function createEmptyEmployerCompanyProfile(input?: {
  contactEmail?: string;
}): CompanyProfile {
  return {
    ...employerCompanyProfile,
    id: "",
    companyName: "",
    slug: "",
    logoUrl: "",
    bannerUrl: "",
    tagline: "",
    about: "",
    industry: "",
    companySize: "",
    website: "",
    headquarters: "",
    contactEmail: input?.contactEmail ?? "",
    phone: "",
    address: "",
    socialLinks: [],
    openRolesCount: 0,
    verified: false,
    hiringStatus: "Hiring selectively",
    profileCompletionPercentage: 0,
    highlights: [],
    benefits: [],
    culture: [],
  };
}

export async function getEmployerCompanyProfile() {
  const response = await api.get<
    | ApiEnvelope<EmployerCompanyApiResponse | null>
    | EmployerCompanyApiResponse
    | null
  >("/employer/company");
  const company = unwrap<EmployerCompanyApiResponse | null>(response);

  return company ? normalizeEmployerCompanyProfile(company) : null;
}

export async function createEmployerCompanyProfile(
  payload: EmployerCompanyProfileCreatePayload,
) {
  const response = await api.post<
    ApiEnvelope<EmployerCompanyApiResponse> | EmployerCompanyApiResponse
  >("/employer/company", payload);

  return normalizeEmployerCompanyProfile(unwrap<EmployerCompanyApiResponse>(response));
}

export async function updateEmployerCompanyProfile(
  payload: EmployerCompanyProfileUpdatePayload,
) {
  const response = await api.patch<
    ApiEnvelope<EmployerCompanyApiResponse> | EmployerCompanyApiResponse
  >("/employer/company", payload);

  return normalizeEmployerCompanyProfile(unwrap<EmployerCompanyApiResponse>(response));
}

export async function uploadEmployerCompanyLogo(formData: FormData) {
  const response = await api.post<
    ApiEnvelope<EmployerCompanyApiResponse> | EmployerCompanyApiResponse
  >("/employer/company/logo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return normalizeEmployerCompanyProfile(unwrap<EmployerCompanyApiResponse>(response));
}

export async function uploadEmployerCompanyBanner(formData: FormData) {
  const response = await api.post<
    ApiEnvelope<EmployerCompanyApiResponse> | EmployerCompanyApiResponse
  >("/employer/company/banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return normalizeEmployerCompanyProfile(unwrap<EmployerCompanyApiResponse>(response));
}
