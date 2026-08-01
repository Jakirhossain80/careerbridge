import { Types } from "mongoose";

import {
  JOB_STATUS,
  USER_ROLES,
  type UserRole,
} from "../constants/model.constants.js";
import Application from "../models/application.model.js";
import Company from "../models/company.model.js";
import Interview from "../models/interview.model.js";
import Job from "../models/job.model.js";
import Report from "../models/report.model.js";
import User from "../models/user.model.js";
import type { AuthenticatedFirebaseUser } from "../middlewares/auth.middleware.js";
import AppError from "../utils/AppError.js";
import type { DashboardSearchQuery } from "../validations/dashboardSearch.validation.js";
import { publicCompanyVisibilityFilter } from "./company.service.js";

export type DashboardSearchCategory =
  | "jobs"
  | "companies"
  | "applicants"
  | "interviews"
  | "users"
  | "reports";

export type DashboardSearchResult = {
  id: string;
  category: DashboardSearchCategory;
  title: string;
  subtitle?: string;
  href: string;
};

export type DashboardSearchGroup = {
  category: DashboardSearchCategory;
  label: string;
  results: DashboardSearchResult[];
};

export type DashboardSearchResponse = {
  query: string;
  groups: DashboardSearchGroup[];
  total: number;
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getActor = (user?: AuthenticatedFirebaseUser) => {
  if (!user?.mongoUserId || !Types.ObjectId.isValid(user.mongoUserId) || !user.role) {
    throw new AppError("Authenticated user profile is required", 401);
  }

  return {
    id: new Types.ObjectId(user.mongoUserId),
    role: user.role as UserRole,
  };
};

const createResponse = (query: string, groups: DashboardSearchGroup[]) => ({
  query,
  groups,
  total: groups.reduce((total, group) => total + group.results.length, 0),
});

const searchForJobSeeker = async (
  query: DashboardSearchQuery,
): Promise<DashboardSearchResponse> => {
  const regex = new RegExp(escapeRegex(query.q), "i");
  const companies = await Company.find({
    $and: [
      publicCompanyVisibilityFilter,
      { $or: [{ name: regex }, { companyName: regex }, { industry: regex }] },
    ],
  })
    .select("name companyName slug industry location")
    .limit(query.limitPerCategory)
    .lean();

  const publicCompanyIds = await Company.find(publicCompanyVisibilityFilter)
    .distinct("_id");
  const jobs = await Job.find({
    companyId: { $in: publicCompanyIds },
    status: { $in: [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED] },
    deadline: { $gte: new Date() },
    $or: [
      { title: regex },
      { companyName: regex },
      { category: regex },
      { skills: regex },
      { location: regex },
    ],
  })
    .select("title slug companyName location")
    .limit(query.limitPerCategory)
    .lean();

  return createResponse(query.q, [
    {
      category: "jobs",
      label: "Jobs",
      results: jobs.map((job) => ({
        id: job._id.toString(),
        category: "jobs",
        title: job.title,
        subtitle: [job.companyName, job.location].filter(Boolean).join(" · "),
        href: `/jobs/${job.slug || job._id.toString()}`,
      })),
    },
    {
      category: "companies",
      label: "Companies",
      results: companies.map((company) => ({
        id: company._id.toString(),
        category: "companies",
        title: company.companyName || company.name,
        subtitle: [company.industry, company.location].filter(Boolean).join(" · "),
        href: `/companies/${company.slug || company._id.toString()}`,
      })),
    },
  ]);
};

const searchForEmployer = async (
  employerId: Types.ObjectId,
  query: DashboardSearchQuery,
): Promise<DashboardSearchResponse> => {
  const regex = new RegExp(escapeRegex(query.q), "i");
  const [jobs, matchingJobIds, matchingApplicantIds] = await Promise.all([
    Job.find({
      employerId,
      $or: [{ title: regex }, { companyName: regex }, { location: regex }],
    })
      .select("title companyName status")
      .limit(query.limitPerCategory)
      .lean(),
    Job.find({
      employerId,
      $or: [{ title: regex }, { companyName: regex }, { location: regex }],
    }).distinct("_id"),
    User.find({
      role: USER_ROLES.JOB_SEEKER,
      $or: [{ name: regex }, { email: regex }],
    }).distinct("_id"),
  ]);

  const [applications, interviews] = await Promise.all([
    Application.find({
      employerId,
      $or: [
        { applicantName: regex },
        { applicantEmail: regex },
        { jobId: { $in: matchingJobIds } },
      ],
    })
      .select("applicantName applicantEmail status jobId")
      .limit(query.limitPerCategory)
      .lean(),
    Interview.find({
      employerId,
      $or: [
        { jobId: { $in: matchingJobIds } },
        { applicantId: { $in: matchingApplicantIds } },
      ],
    })
      .select("applicationId jobId applicantId status dateTime")
      .populate({ path: "jobId", select: "title" })
      .populate({ path: "applicantId", select: "name email" })
      .limit(query.limitPerCategory)
      .lean(),
  ]);

  return createResponse(query.q, [
    {
      category: "jobs",
      label: "Jobs",
      results: jobs.map((job) => ({
        id: job._id.toString(),
        category: "jobs",
        title: job.title,
        subtitle: [job.companyName, job.status].filter(Boolean).join(" · "),
        href: `/employer/jobs/${job._id.toString()}/edit`,
      })),
    },
    {
      category: "applicants",
      label: "Applicants",
      results: applications.map((application) => ({
        id: application._id.toString(),
        category: "applicants",
        title: application.applicantName || application.applicantEmail || "Applicant",
        subtitle: application.status,
        href: `/employer/applicants/${application._id.toString()}`,
      })),
    },
    {
      category: "interviews",
      label: "Interviews",
      results: interviews.map((interview) => {
        const job = interview.jobId as unknown as { title?: string } | null;
        const applicant = interview.applicantId as unknown as { name?: string; email?: string } | null;
        return {
          id: interview._id.toString(),
          category: "interviews" as const,
          title: applicant?.name || applicant?.email || job?.title || "Interview",
          subtitle: [job?.title, interview.status].filter(Boolean).join(" · "),
          href: `/employer/interviews/${interview._id.toString()}`,
        };
      }),
    },
  ]);
};

const searchForAdmin = async (
  query: DashboardSearchQuery,
): Promise<DashboardSearchResponse> => {
  const regex = new RegExp(escapeRegex(query.q), "i");
  const [users, jobs, reports] = await Promise.all([
    User.find({
      isDeleted: false,
      $or: [{ name: regex }, { email: regex }],
    })
      .select("name email role status")
      .limit(query.limitPerCategory)
      .lean(),
    Job.find({ $or: [{ title: regex }, { companyName: regex }, { location: regex }] })
      .select("title companyName status")
      .limit(query.limitPerCategory)
      .lean(),
    Report.find({
      $or: [
        { reporterName: regex },
        { reporterEmail: regex },
        { targetLabel: regex },
        { reason: regex },
      ],
    })
      .select("reason targetLabel severity status")
      .limit(query.limitPerCategory)
      .lean(),
  ]);

  return createResponse(query.q, [
    {
      category: "users",
      label: "Users",
      results: users.map((user) => ({
        id: user._id.toString(),
        category: "users",
        title: user.name,
        subtitle: [user.email, user.role].join(" · "),
        href: `/admin/users/${user._id.toString()}`,
      })),
    },
    {
      category: "jobs",
      label: "Jobs",
      results: jobs.map((job) => ({
        id: job._id.toString(),
        category: "jobs",
        title: job.title,
        subtitle: [job.companyName, job.status].filter(Boolean).join(" · "),
        href: `/admin/jobs/${job._id.toString()}`,
      })),
    },
    {
      category: "reports",
      label: "Reports",
      results: reports.map((report) => ({
        id: report._id.toString(),
        category: "reports",
        title: report.targetLabel || report.reason,
        subtitle: [report.severity, report.status].filter(Boolean).join(" · "),
        href: `/admin/reports/${report._id.toString()}`,
      })),
    },
  ]);
};

export const searchDashboard = async (
  user: AuthenticatedFirebaseUser | undefined,
  query: DashboardSearchQuery,
) => {
  const actor = getActor(user);

  if (actor.role === USER_ROLES.JOB_SEEKER) return searchForJobSeeker(query);
  if (actor.role === USER_ROLES.EMPLOYER) return searchForEmployer(actor.id, query);
  if (actor.role === USER_ROLES.ADMIN || actor.role === USER_ROLES.SUPER_ADMIN) {
    return searchForAdmin(query);
  }

  throw new AppError("Dashboard search is not available for this role", 403);
};
