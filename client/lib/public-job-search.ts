import type { JobType, PublicJobsParams, WorkMode } from "@/types/job.types";

export type PublicJobView = "grid" | "list";

const jobTypes: JobType[] = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "temporary",
  "freelance",
];
const workModes: WorkMode[] = ["remote", "onsite", "hybrid"];
const sorts = [
  "-createdAt",
  "createdAt",
  "-salaryMin",
  "salaryMin",
  "-applicationsCount",
] as const;

const getText = (params: URLSearchParams, key: string) => {
  const value = params.get(key)?.trim().replace(/\s+/g, " ");
  return value || undefined;
};

const getPositiveInteger = (params: URLSearchParams, key: string) => {
  const value = Number(params.get(key));
  return Number.isInteger(value) && value > 0 ? value : undefined;
};

const getNonNegativeNumber = (params: URLSearchParams, key: string) => {
  const rawValue = params.get(key);
  if (rawValue === null || rawValue === "") return undefined;
  const value = Number(rawValue);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
};

export function readPublicJobParams(params: URLSearchParams): PublicJobsParams {
  const jobType = getText(params, "jobType");
  const workMode = getText(params, "workMode");
  const sort = getText(params, "sort");

  return removeDefaultPublicJobParams({
    page: getPositiveInteger(params, "page"),
    limit: getPositiveInteger(params, "limit"),
    search: getText(params, "search"),
    keyword: getText(params, "keyword"),
    title: getText(params, "title"),
    company: getText(params, "company"),
    companyId: getText(params, "companyId"),
    skill: getText(params, "skill"),
    location: getText(params, "location"),
    category: getText(params, "category"),
    industry: getText(params, "industry"),
    experienceLevel: getText(params, "experienceLevel"),
    salaryMin: getNonNegativeNumber(params, "salaryMin"),
    salaryMax: getNonNegativeNumber(params, "salaryMax"),
    currency: getText(params, "currency"),
    featured: params.get("featured") === "true" ? true : undefined,
    createdFrom: getText(params, "createdFrom"),
    createdTo: getText(params, "createdTo"),
    jobType: jobTypes.includes(jobType as JobType) ? (jobType as JobType) : undefined,
    workMode: workModes.includes(workMode as WorkMode) ? (workMode as WorkMode) : undefined,
    sort: sorts.includes(sort as (typeof sorts)[number]) ? sort : undefined,
  });
}

export function removeDefaultPublicJobParams(
  params: PublicJobsParams,
): PublicJobsParams {
  return Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value,
      ] as const)
      .filter(([, value]) => value !== undefined && value !== "" && value !== false),
  ) as PublicJobsParams;
}

export function writePublicJobParams(params: PublicJobsParams) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(removeDefaultPublicJobParams(params))) {
    if (key === "page" && value === 1) continue;
    searchParams.set(key, String(value));
  }
  return searchParams;
}

export function updatePublicJobParams(
  current: PublicJobsParams,
  updates: Partial<PublicJobsParams>,
  resetPage = true,
) {
  return removeDefaultPublicJobParams({
    ...current,
    ...updates,
    ...(resetPage ? { page: undefined } : {}),
  });
}
