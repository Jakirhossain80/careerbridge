import type {
  RecommendedJob,
  RecommendedJobsQueryParams,
  RecommendedJobsResponse,
} from "@/types/recommended-job.types";

export const mockRecommendedJobs: RecommendedJob[] = [
  {
    _id: "job-301",
    slug: "frontend-platform-engineer",
    title: "Frontend Platform Engineer",
    companyName: "Greenline Systems",
    location: "Remote",
    workMode: "remote",
    employmentType: "Full-time",
    jobType: "full_time",
    salaryMin: 115000,
    salaryMax: 145000,
    currency: "USD",
    experienceLevel: "Senior level",
    category: "Engineering",
    skills: ["React", "TypeScript", "Next.js", "Design Systems"],
    description:
      "Build reusable frontend foundations for a hiring platform used by distributed product teams.",
    postedAt: "2026-06-22T09:30:00.000Z",
    applicationDeadline: "2026-07-20T23:59:59.000Z",
    matchScore: 96,
    matchReasons: ["Skill Match", "Experience Match", "Similar to Saved Jobs"],
    isSaved: false,
    hasApplied: false,
  },
  {
    _id: "job-302",
    slug: "senior-react-developer",
    title: "Senior React Developer",
    companyName: "LaunchGrid",
    location: "Austin, TX",
    workMode: "hybrid",
    employmentType: "Full-time",
    jobType: "full_time",
    salaryMin: 120000,
    salaryMax: 150000,
    currency: "USD",
    experienceLevel: "Senior level",
    category: "Engineering",
    skills: ["React", "GraphQL", "Testing", "Performance"],
    description:
      "Own critical React workflows and collaborate with product teams on fast, accessible customer experiences.",
    postedAt: "2026-06-20T13:15:00.000Z",
    applicationDeadline: "2026-07-18T23:59:59.000Z",
    matchScore: 93,
    matchReasons: ["Skill Match", "Similar to Applied Jobs"],
    isSaved: true,
    savedJobId: "saved-job-302",
    hasApplied: false,
  },
  {
    _id: "job-303",
    slug: "accessibility-engineer",
    title: "Accessibility Engineer",
    companyName: "OpenHealth",
    location: "New York, NY",
    workMode: "hybrid",
    employmentType: "Contract",
    jobType: "contract",
    salaryMin: 90000,
    salaryMax: 115000,
    currency: "USD",
    experienceLevel: "Mid level",
    category: "Engineering",
    skills: ["WCAG", "React", "ARIA", "Design Systems"],
    description:
      "Improve accessibility quality across healthcare products through audits, patterns, and component guidance.",
    postedAt: "2026-06-18T11:00:00.000Z",
    applicationDeadline: "2026-07-12T23:59:59.000Z",
    matchScore: 89,
    matchReasons: ["Skill Match", "Experience Match"],
    isSaved: false,
    hasApplied: true,
  },
  {
    _id: "job-304",
    slug: "product-ui-developer",
    title: "Product UI Developer",
    companyName: "Northstar Digital",
    location: "Remote",
    workMode: "remote",
    employmentType: "Full-time",
    jobType: "full_time",
    salaryMin: 105000,
    salaryMax: 132000,
    currency: "USD",
    experienceLevel: "Mid level",
    category: "Product",
    skills: ["TypeScript", "UX", "Tailwind CSS", "React Query"],
    description:
      "Partner with design and backend teams to ship polished SaaS workflows with strong data-fetching patterns.",
    postedAt: "2026-06-17T15:25:00.000Z",
    applicationDeadline: "2026-07-16T23:59:59.000Z",
    matchScore: 86,
    matchReasons: ["Similar to Saved Jobs"],
    isSaved: false,
    hasApplied: false,
  },
  {
    _id: "job-305",
    slug: "frontend-quality-engineer",
    title: "Frontend Quality Engineer",
    companyName: "CivicCloud",
    location: "Chicago, IL",
    workMode: "onsite",
    employmentType: "Full-time",
    jobType: "full_time",
    salaryMin: 98000,
    salaryMax: 124000,
    currency: "USD",
    experienceLevel: "Mid level",
    category: "Quality Assurance",
    skills: ["Playwright", "React", "CI", "Accessibility"],
    description:
      "Create automated coverage for public sector web products and improve confidence in every release.",
    postedAt: "2026-06-15T08:45:00.000Z",
    applicationDeadline: "2026-07-10T23:59:59.000Z",
    matchScore: 81,
    matchReasons: ["Skill Match", "Similar to Applied Jobs"],
    isSaved: false,
    hasApplied: false,
  },
];

function includes(value: string | undefined, search: string) {
  return value?.toLowerCase().includes(search) ?? false;
}

export function getMockRecommendedJobs(
  params: RecommendedJobsQueryParams = {},
): RecommendedJobsResponse {
  const page = params.page ?? 1;
  const limit = params.limit ?? 6;
  const search = params.search?.trim().toLowerCase();

  let filtered = [...mockRecommendedJobs];

  if (search) {
    const keyword = search;
    filtered = filtered.filter((job) =>
      [
        job.title,
        job.companyName,
        job.category,
        job.location,
        job.description,
        ...(job.skills ?? []),
      ].some((value) => includes(value, keyword)),
    );
  }

  if (params.category) {
    filtered = filtered.filter((job) => job.category === params.category);
  }

  if (params.location) {
    const location = params.location;
    filtered = filtered.filter((job) => includes(job.location, location));
  }

  if (params.employmentType) {
    filtered = filtered.filter((job) => job.employmentType === params.employmentType);
  }

  if (params.workMode) {
    filtered = filtered.filter((job) => job.workMode === params.workMode);
  }

  if (params.experienceLevel) {
    filtered = filtered.filter(
      (job) => job.experienceLevel === params.experienceLevel,
    );
  }

  if (params.salaryMin) {
    filtered = filtered.filter((job) => (job.salaryMax ?? 0) >= params.salaryMin!);
  }

  if (params.salaryMax) {
    filtered = filtered.filter((job) => (job.salaryMin ?? 0) <= params.salaryMax!);
  }

  filtered.sort((a, b) => {
    if (params.sortBy === "newest") {
      return (
        new Date(b.postedAt ?? b.createdAt ?? 0).getTime() -
        new Date(a.postedAt ?? a.createdAt ?? 0).getTime()
      );
    }

    if (params.sortBy === "salary_high") {
      return (b.salaryMax ?? 0) - (a.salaryMax ?? 0);
    }

    if (params.sortBy === "salary_low") {
      return (a.salaryMin ?? 0) - (b.salaryMin ?? 0);
    }

    return (b.matchScore ?? 0) - (a.matchScore ?? 0);
  });

  const total = filtered.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    jobs: filtered.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    totalPages,
  };
}
