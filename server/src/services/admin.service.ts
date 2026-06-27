import type { DecodedIdToken } from "firebase-admin/auth";
import { Types, type PipelineStage, type SortOrder } from "mongoose";

import {
  APPLICATION_STATUS,
  BLOG_STATUS,
  COMPANY_VERIFICATION_STATUS,
  JOB_STATUS,
  REPORT_STATUS,
  USER_ROLES,
  USER_STATUS,
  type BlogStatus,
  type CategoryStatus,
  type CompanyVerificationStatus,
  type JobStatus,
  type ReportStatus,
  type UserRole,
  type UserStatus,
} from "../constants/model.constants.js";
import AppError from "../utils/AppError.js";
import Application, { type IApplication } from "../models/application.model.js";
import Blog, { type IBlog } from "../models/blog.model.js";
import Category, { type ICategory } from "../models/category.model.js";
import Company, { type ICompany } from "../models/company.model.js";
import Job, { type IJob } from "../models/job.model.js";
import JobSeeker from "../models/jobSeeker.model.js";
import Interview from "../models/interview.model.js";
import Report from "../models/report.model.js";
import SystemSettings from "../models/systemSettings.model.js";
import User, { type IUser } from "../models/user.model.js";

type PaginationQuery = {
  search?: string;
  role?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  severity?: string;
  reason?: string;
  targetType?: string;
  reporter?: string;
  assignedModerator?: string;
  page: number;
  limit: number;
  sortBy: string;
};

type AdminActor = {
  id: string;
  firebaseUid: string;
  email: string;
  role: UserRole;
};

type AdminJobSeekerQuery = {
  search?: string;
  status?: string;
  resumeStatus?: string;
  profileCompletion?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
  sortBy: string;
};

type AdminPendingEmployerQuery = {
  search?: string;
  verificationStatus?: string;
  accountStatus?: string;
  industry?: string;
  companySize?: string;
  dateFrom?: string;
  dateTo?: string;
  submittedFrom?: string;
  submittedTo?: string;
  page: number;
  limit: number;
  sortBy: string;
};

type AdminCompanyQuery = {
  search?: string;
  verificationStatus?: string;
  companyStatus?: string;
  industry?: string;
  companySize?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
  sortBy: string;
};

type AdminAnalyticsQuery = {
  dateRange: "today" | "last_7_days" | "last_30_days" | "last_90_days" | "last_12_months" | "custom";
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  company?: string;
  employer?: string;
  location?: string;
};

const defaultSystemSettings = {
  general: {
    platformName: "CareerBridge",
    platformTagline: "Connecting talent with opportunity",
    platformDescription: "CareerBridge is a full-stack job portal for job seekers, employers, recruiters, and administrators.",
    contactEmail: "contact@careerbridge.local",
    supportEmail: "support@careerbridge.local",
    contactPhone: "",
    companyAddress: "",
  },
  platform: {
    maintenanceMode: false,
    publicRegistrationEnabled: true,
    employerRegistrationEnabled: true,
    jobPostingEnabled: true,
    blogModuleEnabled: true,
  },
  authentication: {
    emailLoginEnabled: true,
    googleLoginEnabled: true,
    passwordResetEnabled: true,
    emailVerificationRequired: true,
  },
  registration: {
    autoApproveJobSeekers: true,
    requireProfileCompletion: false,
    resumeUploadRequirement: false,
  },
  employerApproval: {
    employerVerificationRequired: true,
    manualEmployerApproval: true,
    companyVerificationRequired: true,
  },
  jobApproval: {
    manualJobApproval: true,
    autoPublishJobs: false,
    featuredJobRequirements: true,
  },
  blog: {
    blogPublishingEnabled: true,
    commentingEnabled: false,
    featuredBlogsEnabled: true,
  },
  notifications: {
    emailNotifications: true,
    applicationNotifications: true,
    interviewNotifications: true,
    adminNotifications: true,
  },
  email: {
    senderName: "CareerBridge",
    senderEmail: "noreply@careerbridge.local",
    replyToEmail: "support@careerbridge.local",
  },
  security: {
    sessionTimeoutMinutes: 120,
    loginAttemptLimit: 5,
    minimumPasswordLength: 8,
    requirePasswordUppercase: true,
    requirePasswordNumber: true,
    requirePasswordSymbol: false,
    twoFactorRequired: false,
  },
  seo: {
    defaultSeoTitle: "CareerBridge - Find Jobs and Hire Talent",
    defaultSeoDescription: "Discover jobs, manage applications, and connect with employers on CareerBridge.",
    openGraphTitle: "CareerBridge",
    openGraphDescription: "A modern job portal for candidates and employers.",
    openGraphImage: "",
  },
  analytics: {
    analyticsEnabled: true,
    trackingEnabled: true,
    anonymizeIp: true,
    reportingEnabled: true,
  },
};

type SystemSettingsInput = {
  [Key in keyof typeof defaultSystemSettings]: Record<string, unknown>;
};

const mergeSystemSettings = (settings?: Partial<SystemSettingsInput>) => ({
  general: { ...defaultSystemSettings.general, ...settings?.general },
  platform: { ...defaultSystemSettings.platform, ...settings?.platform },
  authentication: { ...defaultSystemSettings.authentication, ...settings?.authentication },
  registration: { ...defaultSystemSettings.registration, ...settings?.registration },
  employerApproval: { ...defaultSystemSettings.employerApproval, ...settings?.employerApproval },
  jobApproval: { ...defaultSystemSettings.jobApproval, ...settings?.jobApproval },
  blog: { ...defaultSystemSettings.blog, ...settings?.blog },
  notifications: { ...defaultSystemSettings.notifications, ...settings?.notifications },
  email: { ...defaultSystemSettings.email, ...settings?.email },
  security: { ...defaultSystemSettings.security, ...settings?.security },
  seo: { ...defaultSystemSettings.seo, ...settings?.seo },
  analytics: { ...defaultSystemSettings.analytics, ...settings?.analytics },
});

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildSort = (sortBy: string): Record<string, SortOrder> => {
  const direction = sortBy.startsWith("-") ? -1 : 1;
  const field = sortBy.replace(/^-/, "");

  return { [field]: direction };
};

const buildAggregationSort = (sortBy: string): Record<string, 1 | -1> => {
  const direction = sortBy.startsWith("-") ? -1 : 1;
  const field = sortBy.replace(/^-/, "");

  return { [field]: direction };
};

const getPaginationMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
});

const generateUniqueSlug = async (
  model: { exists: (filter: Record<string, unknown>) => Promise<unknown> },
  baseValue: string,
  existingId?: string
) => {
  const baseSlug = slugify(baseValue) || "careerbridge";
  let slug = baseSlug;
  let suffix = 1;

  while (
    await model.exists({
      slug,
      ...(existingId ? { _id: { $ne: existingId } } : {}),
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

export const getAuthenticatedAdmin = async (
  firebaseUser?: DecodedIdToken
): Promise<AdminActor> => {
  if (!firebaseUser?.email) {
    throw new AppError("Unauthorized: missing Firebase user", 401);
  }

  const user = await User.findOne({
    $or: [
      { firebaseUid: firebaseUser.uid },
      { email: firebaseUser.email.toLowerCase() },
    ],
  }).select("_id firebaseUid email role status");

  if (!user) {
    throw new AppError("Admin user profile not found", 404);
  }

  if (!isAdminRole(user.role)) {
    throw new AppError("Forbidden: admin access required", 403);
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new AppError("Forbidden: admin account is not active", 403);
  }

  return {
    id: user._id.toString(),
    firebaseUid: user.firebaseUid,
    email: user.email,
    role: user.role,
  };
};

const assertSuperAdmin = (actor: AdminActor) => {
  if (actor.role !== USER_ROLES.SUPER_ADMIN) {
    throw new AppError("Only super admins can manage admin roles", 403);
  }
};

const assertCanManageUser = (actor: AdminActor, target: IUser & { _id: unknown }) => {
  if (target._id?.toString() === actor.id) {
    return;
  }

  if (isAdminRole(target.role)) {
    assertSuperAdmin(actor);
  }
};

const buildSearchRegex = (search?: string) =>
  search ? new RegExp(escapeRegex(search), "i") : undefined;

const isAdminRole = (role: UserRole) =>
  role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;

export const getAdminStats = async () => {
  const [
    totalUsers,
    totalJobSeekers,
    totalEmployers,
    totalJobs,
    pendingJobs,
    totalApplications,
    pendingEmployers,
    blockedUsers,
    reports,
    recentUsers,
    recentJobs,
    recentApplications,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: USER_ROLES.JOB_SEEKER }),
    User.countDocuments({ role: USER_ROLES.EMPLOYER }),
    Job.countDocuments(),
    Job.countDocuments({ status: JOB_STATUS.PENDING }),
    Application.countDocuments(),
    Company.countDocuments({
      $or: [
        { status: COMPANY_VERIFICATION_STATUS.PENDING },
        { verificationStatus: COMPANY_VERIFICATION_STATUS.PENDING },
      ],
    }),
    User.countDocuments({ status: USER_STATUS.BLOCKED }),
    Report.countDocuments({ status: REPORT_STATUS.PENDING }),
    User.find().sort({ createdAt: -1 }).limit(4).select("name email role createdAt").lean(),
    Job.find().sort({ createdAt: -1 }).limit(4).select("title status createdAt").lean(),
    Application.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select("applicantName applicantEmail status createdAt")
      .lean(),
  ]);

  const recentActivity = [
    ...recentUsers.map((item) => ({
      id: item._id.toString(),
      type: "user",
      label: item.name || item.email,
      status: item.role,
      createdAt: item.createdAt,
    })),
    ...recentJobs.map((item) => ({
      id: item._id.toString(),
      type: "job",
      label: item.title,
      status: item.status,
      createdAt: item.createdAt,
    })),
    ...recentApplications.map((item) => ({
      id: item._id.toString(),
      type: "application",
      label: item.applicantName || item.applicantEmail || "Application",
      status: item.status,
      createdAt: item.createdAt,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 10);

  return {
    totalUsers,
    totalJobSeekers,
    totalEmployers,
    totalJobs,
    pendingJobs,
    totalApplications,
    pendingEmployers,
    reports,
    blockedUsers,
    recentActivity,
  };
};

export const listAdminUsers = async (query: PaginationQuery) => {
  const filter: Record<string, unknown> = {};
  const regex = buildSearchRegex(query.search);

  if (query.role === "admins") {
    filter.role = { $in: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] };
  } else if (query.role) {
    filter.role = query.role;
  }

  if (query.status) filter.status = query.status;
  if (query.dateFrom || query.dateTo) {
    const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
    if (dateTo) dateTo.setHours(23, 59, 59, 999);

    filter.createdAt = {
      ...(query.dateFrom ? { $gte: new Date(query.dateFrom) } : {}),
      ...(dateTo ? { $lte: dateTo } : {}),
    };
  }

  if (regex) {
    const searchConditions: Record<string, unknown>[] = [
      { name: regex },
      { email: regex },
      { firebaseUid: regex },
    ];

    if (query.search && Types.ObjectId.isValid(query.search)) {
      searchConditions.push({ _id: new Types.ObjectId(query.search) });
    }

    filter.$or = searchConditions;
  }

  const skip = (query.page - 1) * query.limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort(buildSort(query.sortBy)).skip(skip).limit(query.limit).lean(),
    User.countDocuments(filter),
  ]);

  return { users, meta: getPaginationMeta(query.page, query.limit, total) };
};

const buildJobSeekerBasePipeline = (
  query: Partial<AdminJobSeekerQuery> = {}
): PipelineStage[] => {
  const match: Record<string, unknown> = { role: USER_ROLES.JOB_SEEKER };
  const searchRegex = buildSearchRegex(query.search);
  const locationRegex = buildSearchRegex(query.location);

  if (query.status) match.status = query.status;
  if (query.dateFrom || query.dateTo) {
    const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
    if (dateTo) dateTo.setHours(23, 59, 59, 999);

    match.createdAt = {
      ...(query.dateFrom ? { $gte: new Date(query.dateFrom) } : {}),
      ...(dateTo ? { $lte: dateTo } : {}),
    };
  }

  const pipeline: PipelineStage[] = [
    { $match: match },
    {
      $lookup: {
        from: "jobseekers",
        localField: "_id",
        foreignField: "userId",
        as: "jobSeekerProfile",
      },
    },
    {
      $unwind: {
        path: "$jobSeekerProfile",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "resumes",
        let: { profileId: "$jobSeekerProfile._id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$jobSeekerId", "$$profileId"] } } },
          { $sort: { isDefault: -1, uploadedAt: -1 } },
          {
            $group: {
              _id: "$jobSeekerId",
              count: { $sum: 1 },
              defaultResume: { $first: "$$ROOT" },
            },
          },
        ],
        as: "resumeSummary",
      },
    },
    {
      $unwind: {
        path: "$resumeSummary",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "applicantId",
        as: "applications",
      },
    },
    {
      $addFields: {
        applicationsCount: { $size: "$applications" },
        lastApplicationActivityAt: { $max: "$applications.updatedAt" },
        avatar: { $ifNull: ["$photoURL", "$jobSeekerProfile.avatar"] },
        phone: "$jobSeekerProfile.phone",
        location: "$jobSeekerProfile.location",
        professionalHeadline: "$jobSeekerProfile.headline",
        skills: { $ifNull: ["$jobSeekerProfile.skills", []] },
        resume: "$resumeSummary.defaultResume",
        resumeStatus: {
          $cond: [
            { $gt: [{ $ifNull: ["$resumeSummary.count", 0] }, 0] },
            {
              $cond: [
                { $eq: ["$resumeSummary.defaultResume.isDefault", true] },
                "active",
                "uploaded",
              ],
            },
            "missing",
          ],
        },
        profileCompletion: {
          $round: [
            {
              $multiply: [
                {
                  $divide: [
                    {
                      $add: [
                        { $cond: [{ $ifNull: ["$name", false] }, 1, 0] },
                        { $cond: [{ $ifNull: ["$email", false] }, 1, 0] },
                        { $cond: [{ $ifNull: ["$jobSeekerProfile.phone", false] }, 1, 0] },
                        { $cond: [{ $ifNull: ["$jobSeekerProfile.location", false] }, 1, 0] },
                        { $cond: [{ $ifNull: ["$jobSeekerProfile.headline", false] }, 1, 0] },
                        {
                          $cond: [
                            { $gt: [{ $size: { $ifNull: ["$jobSeekerProfile.skills", []] } }, 0] },
                            1,
                            0,
                          ],
                        },
                        {
                          $cond: [
                            { $gt: [{ $ifNull: ["$resumeSummary.count", 0] }, 0] },
                            1,
                            0,
                          ],
                        },
                      ],
                    },
                    7,
                  ],
                },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        lastActivityAt: {
          $max: ["$updatedAt", "$jobSeekerProfile.updatedAt", "$lastApplicationActivityAt"],
        },
      },
    },
  ];

  const postLookupMatch: Record<string, unknown> = {};

  if (searchRegex) {
    postLookupMatch.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { firebaseUid: searchRegex },
      { phone: searchRegex },
      { location: searchRegex },
      { professionalHeadline: searchRegex },
      { skills: searchRegex },
    ];

    if (query.search && Types.ObjectId.isValid(query.search)) {
      (postLookupMatch.$or as Record<string, unknown>[]).push({
        _id: new Types.ObjectId(query.search),
      });
    }
  }

  if (locationRegex) postLookupMatch.location = locationRegex;
  if (query.resumeStatus) postLookupMatch.resumeStatus = query.resumeStatus;

  if (query.profileCompletion) {
    if (query.profileCompletion === "under_50") {
      postLookupMatch.profileCompletion = { $lt: 50 };
    } else if (query.profileCompletion === "50_79") {
      postLookupMatch.profileCompletion = { $gte: 50, $lte: 79 };
    } else if (query.profileCompletion === "80_100") {
      postLookupMatch.profileCompletion = { $gte: 80 };
    } else if (query.profileCompletion === "complete") {
      postLookupMatch.profileCompletion = 100;
    } else if (query.profileCompletion === "incomplete") {
      postLookupMatch.profileCompletion = { $lt: 100 };
    }
  }

  if (Object.keys(postLookupMatch).length > 0) {
    pipeline.push({ $match: postLookupMatch });
  }

  return pipeline;
};

const buildJobSeekerSort = (sortBy: string): Record<string, 1 | -1> => {
  const allowed = new Set(["createdAt", "name", "profileCompletion"]);
  const direction = sortBy.startsWith("-") ? -1 : 1;
  const field = sortBy.replace(/^-/, "");

  return { [allowed.has(field) ? field : "createdAt"]: direction };
};

const projectAdminJobSeeker: PipelineStage.Project = {
  $project: {
    _id: 1,
    firebaseUid: 1,
    name: 1,
    email: 1,
    avatar: 1,
    photoURL: 1,
    role: 1,
    status: 1,
    phone: 1,
    location: 1,
    professionalHeadline: 1,
    profileCompletion: 1,
    resumeStatus: 1,
    skills: 1,
    applicationsCount: 1,
    createdAt: 1,
    updatedAt: 1,
    lastActivityAt: 1,
    resume: {
      _id: "$resume._id",
      fileName: "$resume.fileName",
      fileUrl: "$resume.fileUrl",
      fileType: "$resume.fileType",
      uploadedAt: "$resume.uploadedAt",
    },
  },
};

export const listAdminJobSeekers = async (query: AdminJobSeekerQuery) => {
  const skip = (query.page - 1) * query.limit;
  const pipeline = buildJobSeekerBasePipeline(query);

  const [result] = await User.aggregate<{
    jobSeekers: unknown[];
    total: Array<{ count: number }>;
  }>([
    ...pipeline,
    {
      $facet: {
        jobSeekers: [
          { $sort: buildJobSeekerSort(query.sortBy) },
          { $skip: skip },
          { $limit: query.limit },
          projectAdminJobSeeker,
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = result?.total[0]?.count ?? 0;

  return {
    jobSeekers: result?.jobSeekers ?? [],
    meta: getPaginationMeta(query.page, query.limit, total),
  };
};

export const getAdminJobSeekerStats = async () => {
  const [stats] = await User.aggregate<{
    totalJobSeekers: number;
    blockedAccounts: number;
    activeApplications: number;
    averageProfileCompletion: number;
  }>([
    ...buildJobSeekerBasePipeline(),
    {
      $group: {
        _id: null,
        totalJobSeekers: { $sum: 1 },
        blockedAccounts: {
          $sum: { $cond: [{ $eq: ["$status", USER_STATUS.BLOCKED] }, 1, 0] },
        },
        activeApplications: { $sum: "$applicationsCount" },
        averageProfileCompletion: { $avg: "$profileCompletion" },
      },
    },
    {
      $project: {
        _id: 0,
        totalJobSeekers: 1,
        blockedAccounts: 1,
        activeApplications: 1,
        averageProfileCompletion: { $round: ["$averageProfileCompletion", 0] },
      },
    },
  ]);

  return {
    totalJobSeekers: stats?.totalJobSeekers ?? 0,
    activeApplications: stats?.activeApplications ?? 0,
    averageProfileCompletion: stats?.averageProfileCompletion ?? 0,
    blockedAccounts: stats?.blockedAccounts ?? 0,
  };
};

export const getAdminJobSeeker = async (jobSeekerId: string) => {
  const [jobSeeker] = await User.aggregate([
    { $match: { _id: new Types.ObjectId(jobSeekerId), role: USER_ROLES.JOB_SEEKER } },
    ...buildJobSeekerBasePipeline(),
    projectAdminJobSeeker,
  ]);

  if (!jobSeeker) throw new AppError("Job seeker not found", 404);

  return jobSeeker;
};

export const updateAdminJobSeeker = async (
  actor: AdminActor,
  jobSeekerId: string,
  input: Partial<IUser> & {
    phone?: string;
    location?: string;
    professionalHeadline?: string;
  }
) => {
  const target = await User.findOne({
    _id: jobSeekerId,
    role: USER_ROLES.JOB_SEEKER,
  });
  if (!target) throw new AppError("Job seeker not found", 404);
  assertCanManageUser(actor, target);

  const userUpdate: Partial<IUser> = {};
  if (input.name !== undefined) userUpdate.name = input.name;
  if (input.photoURL !== undefined) userUpdate.photoURL = input.photoURL;
  if (input.status !== undefined) userUpdate.status = input.status;

  if (Object.keys(userUpdate).length > 0) {
    Object.assign(target, userUpdate);
    await target.save();
  }

  const profileUpdate: Record<string, string> = {};
  if (input.name !== undefined) profileUpdate.fullName = input.name;
  if (input.phone !== undefined) profileUpdate.phone = input.phone;
  if (input.location !== undefined) profileUpdate.location = input.location;
  if (input.professionalHeadline !== undefined) {
    profileUpdate.headline = input.professionalHeadline;
  }

  if (Object.keys(profileUpdate).length > 0) {
    await JobSeeker.findOneAndUpdate(
      { userId: target._id },
      { $set: profileUpdate },
      { new: true }
    );
  }

  return getAdminJobSeeker(jobSeekerId);
};

export const updateAdminJobSeekerStatus = async (
  actor: AdminActor,
  jobSeekerId: string,
  status: UserStatus
) => updateAdminJobSeeker(actor, jobSeekerId, { status });

export const getAdminUser = async (userId: string) => {
  const user = await User.findById(userId).lean();

  if (!user) throw new AppError("User not found", 404);

  return user;
};

export const updateAdminUser = async (
  actor: AdminActor,
  userId: string,
  input: Partial<IUser>
) => {
  const target = await User.findById(userId);
  if (!target) throw new AppError("User not found", 404);
  assertCanManageUser(actor, target);

  if (input.status === USER_STATUS.BLOCKED && target._id.toString() === actor.id) {
    throw new AppError("Admins cannot block themselves", 400);
  }

  Object.assign(target, input);
  await target.save();

  return target;
};

export const deleteAdminUser = async (actor: AdminActor, userId: string) => {
  const target = await User.findById(userId);
  if (!target) throw new AppError("User not found", 404);
  if (target._id.toString() === actor.id) throw new AppError("Admins cannot delete themselves", 400);
  assertCanManageUser(actor, target);

  await target.deleteOne();
  return { deleted: true };
};

export const changeAdminUserRole = async (
  actor: AdminActor,
  userId: string,
  role: UserRole
) => {
  const target = await User.findById(userId);
  if (!target) throw new AppError("User not found", 404);

  if (
    isAdminRole(target.role) ||
    isAdminRole(role)
  ) {
    assertSuperAdmin(actor);
  }

  if (role === USER_ROLES.SUPER_ADMIN && actor.role !== USER_ROLES.SUPER_ADMIN) {
    throw new AppError("Only super admins can promote super admins", 403);
  }

  target.role = role;
  await target.save();

  return target;
};

export const blockAdminUser = async (actor: AdminActor, userId: string) => {
  if (actor.id === userId) throw new AppError("Admins cannot block themselves", 400);
  return updateAdminUser(actor, userId, { status: USER_STATUS.BLOCKED as UserStatus });
};

export const unblockAdminUser = async (actor: AdminActor, userId: string) => {
  return updateAdminUser(actor, userId, { status: USER_STATUS.ACTIVE as UserStatus });
};

export const listAdminEmployers = async (query: PaginationQuery) => {
  const filter: Record<string, unknown> = {};
  const regex = buildSearchRegex(query.search);

  if (query.status) {
    filter.$or = [{ status: query.status }, { verificationStatus: query.status }];
  }

  if (regex) {
    filter.$and = [
      ...(filter.$and as Record<string, unknown>[] | undefined ?? []),
      {
        $or: [
          { name: regex },
          { companyName: regex },
          { ownerEmail: regex },
          { industry: regex },
          { location: regex },
          { headquarters: regex },
        ],
      },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [employers, total] = await Promise.all([
    Company.find(filter)
      .populate("ownerId", "name email status role")
      .sort(buildSort(query.sortBy))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Company.countDocuments(filter),
  ]);

  return { employers, meta: getPaginationMeta(query.page, query.limit, total) };
};

const buildAdminCompanyPipeline = (query: AdminCompanyQuery): PipelineStage[] => {
  const baseMatch: Record<string, unknown> = {};
  const searchRegex = buildSearchRegex(query.search);

  if (query.verificationStatus) {
    baseMatch.$or = [
      { status: query.verificationStatus },
      { verificationStatus: query.verificationStatus },
    ];
  }

  if (query.industry) {
    baseMatch.industry = buildSearchRegex(query.industry);
  }

  if (query.companySize) {
    baseMatch.$and = [
      ...(baseMatch.$and as Record<string, unknown>[] | undefined ?? []),
      {
        $or: [
          { size: buildSearchRegex(query.companySize) },
          { companySize: buildSearchRegex(query.companySize) },
        ],
      },
    ];
  }

  if (query.dateFrom || query.dateTo) {
    const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
    if (dateTo) dateTo.setHours(23, 59, 59, 999);

    baseMatch.createdAt = {
      ...(query.dateFrom ? { $gte: new Date(query.dateFrom) } : {}),
      ...(dateTo ? { $lte: dateTo } : {}),
    };
  }

  const postLookupMatch: Record<string, unknown> = {};

  if (query.companyStatus) {
    postLookupMatch["owner.status"] = query.companyStatus;
  }

  if (searchRegex) {
    postLookupMatch.$or = [
      { name: searchRegex },
      { companyName: searchRegex },
      { slug: searchRegex },
      { ownerEmail: searchRegex },
      { email: searchRegex },
      { website: searchRegex },
      { industry: searchRegex },
      { location: searchRegex },
      { headquarters: searchRegex },
      { "owner.name": searchRegex },
      { "owner.email": searchRegex },
    ];

    if (query.search && Types.ObjectId.isValid(query.search)) {
      (postLookupMatch.$or as Record<string, unknown>[]).push({
        _id: new Types.ObjectId(query.search),
      });
    }
  }

  return [
    { $match: baseMatch },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "jobs",
        let: { companyId: "$_id", companyName: "$name" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$companyId", "$$companyId"] },
                  { $eq: ["$companyName", "$$companyName"] },
                ],
              },
              status: { $in: [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED] },
            },
          },
        ],
        as: "activeJobs",
      },
    },
    {
      $addFields: {
        ownerId: "$owner",
        companyStatus: "$owner.status",
        activeJobsCount: { $size: "$activeJobs" },
      },
    },
    ...(Object.keys(postLookupMatch).length > 0 ? [{ $match: postLookupMatch }] : []),
    { $project: { owner: 0, activeJobs: 0 } },
  ];
};

export const listAdminCompanies = async (query: AdminCompanyQuery) => {
  const skip = (query.page - 1) * query.limit;

  const [result] = await Company.aggregate<{
    companies: unknown[];
    total: Array<{ count: number }>;
  }>([
    ...buildAdminCompanyPipeline(query),
    {
      $facet: {
        companies: [
          { $sort: buildAggregationSort(query.sortBy) },
          { $skip: skip },
          { $limit: query.limit },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = result?.total[0]?.count ?? 0;

  return {
    companies: result?.companies ?? [],
    meta: getPaginationMeta(query.page, query.limit, total),
  };
};

export const getAdminCompanyStats = async () => {
  const pendingCompanyFilter: Record<string, unknown> = {
    $or: [
      {
        status: {
          $in: [
            COMPANY_VERIFICATION_STATUS.PENDING,
            "pending_verification",
            "under_review",
          ],
        },
      },
      {
        verificationStatus: {
          $in: [
            COMPANY_VERIFICATION_STATUS.PENDING,
            "pending_verification",
            "under_review",
          ],
        },
      },
    ],
  };
  const flaggedCompanyFilter: Record<string, unknown> = {
    $or: [
      {
        status: {
          $in: [
            COMPANY_VERIFICATION_STATUS.REJECTED,
            COMPANY_VERIFICATION_STATUS.BLOCKED,
          ],
        },
      },
      {
        verificationStatus: {
          $in: [
            COMPANY_VERIFICATION_STATUS.REJECTED,
            COMPANY_VERIFICATION_STATUS.BLOCKED,
          ],
        },
      },
    ],
  };

  const [totalCompanies, pendingVerification, activeJobListings, flaggedProfiles] =
    await Promise.all([
      Company.countDocuments(),
      Company.countDocuments(pendingCompanyFilter),
      Job.countDocuments({ status: { $in: [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED] } }),
      Company.countDocuments(flaggedCompanyFilter),
    ]);

  return {
    totalCompanies,
    pendingVerification,
    activeJobListings,
    flaggedProfiles,
  };
};

export const getAdminCompany = async (companyId: string) => {
  const result = await listAdminCompanies({
    search: companyId,
    page: 1,
    limit: 1,
    sortBy: "-createdAt",
  });

  const company = result.companies[0];
  if (!company) throw new AppError("Company not found", 404);

  return company;
};

export const updateAdminCompany = async (
  companyId: string,
  input: Partial<ICompany>
) => {
  await updateAdminEmployer(companyId, input);
  return getAdminCompany(companyId);
};

export const updateAdminCompanyVerification = async (
  companyId: string,
  verificationStatus: CompanyVerificationStatus
) => {
  await updateAdminCompany(companyId, {
    status: verificationStatus,
    verificationStatus,
  });
  return getAdminCompany(companyId);
};

export const updateAdminCompanyStatus = async (
  companyId: string,
  status: UserStatus
) => {
  const company = await Company.findById(companyId).select("ownerId");
  if (!company) throw new AppError("Company not found", 404);

  await User.findByIdAndUpdate(company.ownerId, { $set: { status } }, { new: true });
  return getAdminCompany(companyId);
};

const pendingCompanyStatuses = [
  COMPANY_VERIFICATION_STATUS.PENDING,
  "pending_verification",
  "under_review",
];

const buildPendingEmployerMatch = (query: AdminPendingEmployerQuery) => {
  const match: Record<string, unknown> = {
    $or: [
      { status: { $in: pendingCompanyStatuses } },
      { verificationStatus: { $in: pendingCompanyStatuses } },
    ],
  };

  if (query.verificationStatus) {
    match.$or = [
      { status: query.verificationStatus },
      { verificationStatus: query.verificationStatus },
    ];
  }

  if (query.industry) {
    match.industry = buildSearchRegex(query.industry);
  }

  if (query.companySize) {
    match.$and = [
      ...(match.$and as Record<string, unknown>[] | undefined ?? []),
      {
        $or: [
          { size: buildSearchRegex(query.companySize) },
          { companySize: buildSearchRegex(query.companySize) },
        ],
      },
    ];
  }

  if (query.dateFrom || query.dateTo) {
    const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;
    if (dateTo) dateTo.setHours(23, 59, 59, 999);

    match.createdAt = {
      ...(query.dateFrom ? { $gte: new Date(query.dateFrom) } : {}),
      ...(dateTo ? { $lte: dateTo } : {}),
    };
  }

  if (query.submittedFrom || query.submittedTo) {
    const submittedTo = query.submittedTo ? new Date(query.submittedTo) : undefined;
    if (submittedTo) submittedTo.setHours(23, 59, 59, 999);

    match.updatedAt = {
      ...(query.submittedFrom ? { $gte: new Date(query.submittedFrom) } : {}),
      ...(submittedTo ? { $lte: submittedTo } : {}),
    };
  }

  return match;
};

export const getAdminPendingEmployers = async (query: AdminPendingEmployerQuery) => {
  const skip = (query.page - 1) * query.limit;
  const searchRegex = buildSearchRegex(query.search);
  const baseMatch = buildPendingEmployerMatch(query);
  const postLookupMatch: Record<string, unknown> = {};

  if (query.accountStatus) {
    postLookupMatch["owner.status"] = query.accountStatus;
  }

  if (searchRegex) {
    postLookupMatch.$or = [
      { name: searchRegex },
      { companyName: searchRegex },
      { ownerEmail: searchRegex },
      { industry: searchRegex },
      { location: searchRegex },
      { headquarters: searchRegex },
      { "owner.name": searchRegex },
      { "owner.email": searchRegex },
    ];
  }

  const pipeline: PipelineStage[] = [
    { $match: baseMatch },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true,
      },
    },
    ...(Object.keys(postLookupMatch).length > 0 ? [{ $match: postLookupMatch }] : []),
  ];

  const [result, approvedThisMonth, rejectedTotal, totalEmployers] = await Promise.all([
    Company.aggregate<{
      employers: unknown[];
      total: Array<{ count: number }>;
    }>([
      ...pipeline,
      {
        $facet: {
          employers: [
            { $sort: buildAggregationSort(query.sortBy) },
            { $skip: skip },
            { $limit: query.limit },
            {
              $addFields: {
                ownerId: "$owner",
                submittedAt: "$updatedAt",
              },
            },
            { $project: { owner: 0 } },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]),
    Company.countDocuments({
      $or: [
        { status: COMPANY_VERIFICATION_STATUS.APPROVED },
        { verificationStatus: COMPANY_VERIFICATION_STATUS.APPROVED },
      ],
      updatedAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    }),
    Company.countDocuments({
      $or: [
        { status: COMPANY_VERIFICATION_STATUS.REJECTED },
        { verificationStatus: COMPANY_VERIFICATION_STATUS.REJECTED },
      ],
    }),
    Company.countDocuments(),
  ]);

  const total = result?.[0]?.total[0]?.count ?? 0;
  const pendingDates = (result?.[0]?.employers ?? [])
    .map((employer) => {
      const record = employer as { submittedAt?: Date; updatedAt?: Date; createdAt?: Date };
      const value = record.submittedAt ?? record.updatedAt ?? record.createdAt;
      return value ? new Date(value).getTime() : undefined;
    })
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  const averageWaitTimeHours =
    pendingDates.length > 0
      ? Math.round(
          pendingDates.reduce((sum, value) => sum + (Date.now() - value), 0) /
            pendingDates.length /
            36_000,
        ) / 100
      : undefined;

  return {
    employers: result?.[0]?.employers ?? [],
    meta: getPaginationMeta(query.page, query.limit, total),
    stats: {
      awaitingReview: total,
      averageWaitTimeHours,
      approvedThisMonth,
      rejectionRate:
        totalEmployers > 0 ? Math.round((rejectedTotal / totalEmployers) * 100) : 0,
    },
  };
};

export const getAdminEmployer = async (employerId: string) => {
  const employer = await Company.findById(employerId)
    .populate("ownerId", "name email status role")
    .lean();

  if (!employer) throw new AppError("Employer not found", 404);

  return employer;
};

export const updateAdminEmployer = async (
  employerId: string,
  input: Partial<ICompany>
) => {
  const update: Partial<ICompany> = { ...input };
  if (input.companyName) update.name = input.companyName;
  if (input.name) update.companyName = input.name;
  if (input.verificationStatus) update.status = input.verificationStatus;

  const employer = await Company.findByIdAndUpdate(
    employerId,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!employer) throw new AppError("Employer not found", 404);

  return employer;
};

export const approveAdminEmployer = async (employerId: string) =>
  updateAdminEmployer(employerId, {
    status: COMPANY_VERIFICATION_STATUS.APPROVED as CompanyVerificationStatus,
    verificationStatus: COMPANY_VERIFICATION_STATUS.APPROVED as CompanyVerificationStatus,
  });

export const rejectAdminEmployer = async (employerId: string) =>
  updateAdminEmployer(employerId, {
    status: COMPANY_VERIFICATION_STATUS.REJECTED as CompanyVerificationStatus,
    verificationStatus: COMPANY_VERIFICATION_STATUS.REJECTED as CompanyVerificationStatus,
  });

export const listAdminJobs = async (query: PaginationQuery) => {
  const filter: Record<string, unknown> = {};
  const regex = buildSearchRegex(query.search);

  if (query.status) filter.status = query.status;
  if (regex) {
    filter.$or = [
      { title: regex },
      { companyName: regex },
      { category: regex },
      { industry: regex },
      { location: regex },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("employerId", "name email")
      .populate("companyId", "name companyName verificationStatus")
      .sort(buildSort(query.sortBy))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Job.countDocuments(filter),
  ]);

  return { jobs, meta: getPaginationMeta(query.page, query.limit, total) };
};

export const getAdminJob = async (jobId: string) => {
  const job = await Job.findById(jobId)
    .populate("employerId", "name email")
    .populate("companyId", "name companyName verificationStatus")
    .lean();

  if (!job) throw new AppError("Job not found", 404);

  return job;
};

export const updateAdminJob = async (jobId: string, input: Partial<IJob>) => {
  const job = await Job.findByIdAndUpdate(
    jobId,
    { $set: input },
    { new: true, runValidators: true }
  );

  if (!job) throw new AppError("Job not found", 404);

  return job;
};

export const deleteAdminJob = async (jobId: string) => {
  const job = await Job.findByIdAndUpdate(
    jobId,
    { $set: { status: JOB_STATUS.ARCHIVED } },
    { new: true, runValidators: true }
  );

  if (!job) throw new AppError("Job not found", 404);

  return job;
};

export const approveAdminJob = async (jobId: string) =>
  updateAdminJob(jobId, { status: JOB_STATUS.ACTIVE as JobStatus });

export const rejectAdminJob = async (jobId: string) =>
  updateAdminJob(jobId, { status: JOB_STATUS.REJECTED as JobStatus });

export const listAdminApplications = async (query: PaginationQuery) => {
  const filter: Record<string, unknown> = {};
  const regex = buildSearchRegex(query.search);

  if (query.status) filter.status = query.status;
  if (regex) {
    filter.$or = [
      { applicantName: regex },
      { applicantEmail: regex },
      { coverLetter: regex },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("jobId", "title companyName")
      .populate("applicantId", "name email")
      .populate("employerId", "name email")
      .sort(buildSort(query.sortBy))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Application.countDocuments(filter),
  ]);

  return { applications, meta: getPaginationMeta(query.page, query.limit, total) };
};

export const getAdminApplication = async (applicationId: string) => {
  const application = await Application.findById(applicationId)
    .populate("jobId", "title companyName")
    .populate("applicantId", "name email")
    .populate("employerId", "name email")
    .lean();

  if (!application) throw new AppError("Application not found", 404);

  return application;
};

export const updateAdminApplication = async (
  actor: AdminActor,
  applicationId: string,
  input: { status?: string; note?: string }
) => {
  const application = await Application.findById(applicationId);
  if (!application) throw new AppError("Application not found", 404);

  if (input.status) {
    application.status = input.status as IApplication["status"];
    application.timeline.push({
      status: input.status as IApplication["status"],
      note: input.note,
      updatedBy: new Types.ObjectId(actor.id),
    });
  }

  await application.save();
  return application;
};

export const listAdminCategories = async (query: PaginationQuery) => {
  const filter: Record<string, unknown> = {};
  const regex = buildSearchRegex(query.search);

  if (query.status) filter.status = query.status;
  if (regex) filter.$or = [{ name: regex }, { slug: regex }];

  const skip = (query.page - 1) * query.limit;
  const [categories, total] = await Promise.all([
    Category.find(filter).sort(buildSort(query.sortBy)).skip(skip).limit(query.limit).lean(),
    Category.countDocuments(filter),
  ]);

  return { categories, meta: getPaginationMeta(query.page, query.limit, total) };
};

export const createAdminCategory = async (input: Partial<ICategory> & { name: string }) => {
  const slug = input.slug ?? (await generateUniqueSlug(Category, input.name));
  return Category.create({ ...input, slug });
};

export const updateAdminCategory = async (
  categoryId: string,
  input: Partial<ICategory>
) => {
  const update = { ...input };
  if (input.name && !input.slug) {
    update.slug = await generateUniqueSlug(Category, input.name, categoryId);
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!category) throw new AppError("Category not found", 404);

  return category;
};

export const deleteAdminCategory = async (categoryId: string) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { $set: { status: "inactive" as CategoryStatus } },
    { new: true, runValidators: true }
  );

  if (!category) throw new AppError("Category not found", 404);

  return category;
};

export const listAdminBlogs = async (query: PaginationQuery) => {
  const filter: Record<string, unknown> = {};
  const regex = buildSearchRegex(query.search);

  if (query.status) filter.status = query.status;
  if (regex) filter.$or = [{ title: regex }, { slug: regex }, { category: regex }];

  const skip = (query.page - 1) * query.limit;
  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("author", "name email")
      .sort(buildSort(query.sortBy))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  return { blogs, meta: getPaginationMeta(query.page, query.limit, total) };
};

export const getAdminBlog = async (blogId: string) => {
  const blog = await Blog.findById(blogId).populate("author", "name email").lean();

  if (!blog) throw new AppError("Blog not found", 404);

  return blog;
};

export const createAdminBlog = async (
  actor: AdminActor,
  input: Partial<IBlog> & { title: string; content: string }
) => {
  const slug = input.slug ?? (await generateUniqueSlug(Blog, input.title));
  const publishedAt =
    input.status === BLOG_STATUS.PUBLISHED && !input.publishedAt
      ? new Date()
      : input.publishedAt;

  return Blog.create({ ...input, slug, publishedAt, author: actor.id });
};

export const updateAdminBlog = async (blogId: string, input: Partial<IBlog>) => {
  const update = { ...input };
  if (input.title && !input.slug) {
    update.slug = await generateUniqueSlug(Blog, input.title, blogId);
  }
  if (input.status === BLOG_STATUS.PUBLISHED && !input.publishedAt) {
    update.publishedAt = new Date();
  }

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!blog) throw new AppError("Blog not found", 404);

  return blog;
};

export const deleteAdminBlog = async (blogId: string) => {
  const blog = await Blog.findByIdAndUpdate(
    blogId,
    { $set: { status: BLOG_STATUS.ARCHIVED as BlogStatus } },
    { new: true, runValidators: true }
  );

  if (!blog) throw new AppError("Blog not found", 404);

  return blog;
};

export const publishAdminBlog = async (blogId: string) =>
  updateAdminBlog(blogId, { status: BLOG_STATUS.PUBLISHED as BlogStatus });

export const unpublishAdminBlog = async (blogId: string) =>
  updateAdminBlog(blogId, { status: BLOG_STATUS.UNPUBLISHED as BlogStatus });

const getAnalyticsDateWindow = (query: AdminAnalyticsQuery) => {
  const end = query.dateTo ? new Date(query.dateTo) : new Date();
  end.setHours(23, 59, 59, 999);

  const start = query.dateFrom ? new Date(query.dateFrom) : new Date(end);

  if (!query.dateFrom) {
    if (query.dateRange === "today") {
      start.setHours(0, 0, 0, 0);
    } else if (query.dateRange === "last_7_days") {
      start.setDate(end.getDate() - 6);
    } else if (query.dateRange === "last_90_days") {
      start.setDate(end.getDate() - 89);
    } else if (query.dateRange === "last_12_months") {
      start.setMonth(end.getMonth() - 11);
      start.setDate(1);
    } else {
      start.setDate(end.getDate() - 29);
    }
  }

  start.setHours(0, 0, 0, 0);
  const duration = Math.max(end.getTime() - start.getTime(), 24 * 60 * 60 * 1000);
  const previousEnd = new Date(start.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - duration);

  return { start, end, previousStart, previousEnd };
};

const getDateFilter = (start: Date, end: Date) => ({
  createdAt: { $gte: start, $lte: end },
});

const getJobAnalyticsFilter = (query: AdminAnalyticsQuery) => {
  const filter: Record<string, unknown> = {};
  const category = query.category?.trim();
  const company = query.company?.trim();
  const employer = query.employer?.trim();
  const location = query.location?.trim();

  if (category) filter.category = buildSearchRegex(category);
  if (company) filter.companyName = buildSearchRegex(company);
  if (employer) filter.employerEmail = buildSearchRegex(employer);
  if (location) filter.location = buildSearchRegex(location);

  return filter;
};

const getTrendLabel = (date: Date, range: AdminAnalyticsQuery["dateRange"]) => {
  if (range === "today") {
    return new Intl.DateTimeFormat("en", { hour: "numeric" }).format(date);
  }

  if (range === "last_12_months") {
    return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
};

const buildTrendBuckets = (query: AdminAnalyticsQuery, start: Date, end: Date) => {
  const buckets: Array<{
    label: string;
    from: Date;
    to: Date;
    users: number;
    employers: number;
    companies: number;
    jobs: number;
    applications: number;
    interviews: number;
    blogs: number;
  }> = [];
  const bucketCount = query.dateRange === "today" ? 8 : query.dateRange === "last_12_months" ? 12 : 7;
  const span = Math.max(end.getTime() - start.getTime(), 1);

  Array.from({ length: bucketCount }).forEach((_, index) => {
    const from = new Date(start.getTime() + (span / bucketCount) * index);
    const to = new Date(start.getTime() + (span / bucketCount) * (index + 1));
    buckets.push({
      label: getTrendLabel(from, query.dateRange),
      from,
      to,
      users: 0,
      employers: 0,
      companies: 0,
      jobs: 0,
      applications: 0,
      interviews: 0,
      blogs: 0,
    });
  });

  return buckets;
};

const incrementBuckets = (
  buckets: ReturnType<typeof buildTrendBuckets>,
  values: Array<{ createdAt?: Date }>,
  key: "users" | "employers" | "companies" | "jobs" | "applications" | "interviews" | "blogs"
) => {
  values.forEach((value) => {
    if (!value.createdAt) return;
    const timestamp = value.createdAt.getTime();
    const bucket =
      buckets.find((entry) => timestamp >= entry.from.getTime() && timestamp < entry.to.getTime()) ??
      buckets[buckets.length - 1];
    bucket[key] += 1;
  });
};

const getGrowthPercentage = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const toKpi = (
  key: string,
  label: string,
  value: number,
  previous: number,
  comparisonLabel = "vs previous period"
) => {
  const growthPercentage = getGrowthPercentage(value, previous);

  return {
    key,
    label,
    value,
    growthPercentage,
    trend: growthPercentage > 0 ? "up" : growthPercentage < 0 ? "down" : "neutral",
    comparisonLabel,
  };
};

export const getAdminAnalyticsOverview = async (query: AdminAnalyticsQuery) => {
  const { start, end, previousStart, previousEnd } = getAnalyticsDateWindow(query);
  const dateFilter = getDateFilter(start, end);
  const previousDateFilter = getDateFilter(previousStart, previousEnd);
  const jobFilter = getJobAnalyticsFilter(query);
  const filteredJobIds = await Job.find(jobFilter).select("_id").lean();
  const jobIds = filteredJobIds.map((job) => job._id);
  const relatedFilter = jobIds.length > 0 ? { jobId: { $in: jobIds } } : {};

  const [
    totalUsers,
    totalJobSeekers,
    totalEmployers,
    totalCompanies,
    totalJobs,
    activeJobs,
    totalApplications,
    totalInterviews,
    totalBlogs,
    totalCategories,
    previousUsers,
    previousJobSeekers,
    previousEmployers,
    previousCompanies,
    previousJobs,
    previousActiveJobs,
    previousApplications,
    previousInterviews,
    previousBlogs,
    previousCategories,
    trendUsers,
    trendCompanies,
    trendJobs,
    trendApplications,
    trendInterviews,
    trendBlogs,
    categoryRows,
    locationRows,
    funnelRows,
    topCategories,
    topCompanies,
    topEmployers,
    topJobs,
    topJobSeekers,
    topBlogs,
  ] = await Promise.all([
    User.countDocuments({ ...dateFilter }),
    User.countDocuments({ role: USER_ROLES.JOB_SEEKER, ...dateFilter }),
    User.countDocuments({ role: USER_ROLES.EMPLOYER, ...dateFilter }),
    Company.countDocuments({ ...dateFilter }),
    Job.countDocuments({ ...jobFilter, ...dateFilter }),
    Job.countDocuments({
      ...jobFilter,
      status: { $in: [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED] },
      ...dateFilter,
    }),
    Application.countDocuments({ ...relatedFilter, ...dateFilter }),
    Interview.countDocuments({ ...relatedFilter, ...dateFilter }),
    Blog.countDocuments({ ...dateFilter }),
    Category.countDocuments({ ...dateFilter }),
    User.countDocuments({ ...previousDateFilter }),
    User.countDocuments({ role: USER_ROLES.JOB_SEEKER, ...previousDateFilter }),
    User.countDocuments({ role: USER_ROLES.EMPLOYER, ...previousDateFilter }),
    Company.countDocuments({ ...previousDateFilter }),
    Job.countDocuments({ ...jobFilter, ...previousDateFilter }),
    Job.countDocuments({
      ...jobFilter,
      status: { $in: [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED] },
      ...previousDateFilter,
    }),
    Application.countDocuments({ ...relatedFilter, ...previousDateFilter }),
    Interview.countDocuments({ ...relatedFilter, ...previousDateFilter }),
    Blog.countDocuments({ ...previousDateFilter }),
    Category.countDocuments({ ...previousDateFilter }),
    User.find({ ...dateFilter }).select("createdAt role").lean(),
    Company.find({ ...dateFilter }).select("createdAt").lean(),
    Job.find({ ...jobFilter, ...dateFilter }).select("createdAt").lean(),
    Application.find({ ...relatedFilter, ...dateFilter }).select("createdAt").lean(),
    Interview.find({ ...relatedFilter, ...dateFilter }).select("createdAt").lean(),
    Blog.find({ ...dateFilter }).select("createdAt").lean(),
    Job.aggregate([
      { $match: { ...jobFilter, ...dateFilter, category: { $nin: [null, ""] } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    Job.aggregate([
      { $match: { ...jobFilter, ...dateFilter, location: { $nin: [null, ""] } } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    Application.aggregate([
      { $match: { ...relatedFilter, ...dateFilter } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Job.aggregate([
      { $match: { ...jobFilter, ...dateFilter } },
      {
        $group: {
          _id: "$category",
          jobs: { $sum: 1 },
          activeJobs: {
            $sum: {
              $cond: [{ $in: ["$status", [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED]] }, 1, 0],
            },
          },
          applications: { $sum: "$applicationsCount" },
          companies: { $addToSet: "$companyId" },
        },
      },
      { $sort: { applications: -1, jobs: -1 } },
      { $limit: 20 },
    ]),
    Job.aggregate([
      { $match: { ...jobFilter, ...dateFilter } },
      {
        $group: {
          _id: "$companyId",
          company: { $first: "$companyName" },
          location: { $first: "$location" },
          jobs: { $sum: 1 },
          activeJobs: {
            $sum: {
              $cond: [{ $in: ["$status", [JOB_STATUS.ACTIVE, JOB_STATUS.PUBLISHED]] }, 1, 0],
            },
          },
          applications: { $sum: "$applicationsCount" },
        },
      },
      { $sort: { applications: -1, jobs: -1 } },
      { $limit: 20 },
    ]),
    Job.aggregate([
      { $match: { ...jobFilter, ...dateFilter } },
      {
        $group: {
          _id: "$employerId",
          employer: { $first: "$employerEmail" },
          jobs: { $sum: 1 },
          applications: { $sum: "$applicationsCount" },
        },
      },
      { $sort: { applications: -1, jobs: -1 } },
      { $limit: 10 },
    ]),
    Job.find({ ...jobFilter, ...dateFilter })
      .sort({ applicationsCount: -1, createdAt: -1 })
      .limit(10)
      .select("_id title companyName category location applicationsCount status")
      .lean(),
    Application.aggregate([
      { $match: { ...relatedFilter, ...dateFilter } },
      { $group: { _id: "$applicantId", name: { $first: "$applicantName" }, applications: { $sum: 1 } } },
      { $sort: { applications: -1 } },
      { $limit: 10 },
    ]),
    Blog.find({ ...dateFilter })
      .sort({ viewCount: -1, publishedAt: -1, createdAt: -1 })
      .limit(10)
      .select("_id title status viewCount publishedAt")
      .lean(),
  ]);

  const buckets = buildTrendBuckets(query, start, end);
  incrementBuckets(buckets, trendUsers, "users");
  incrementBuckets(
    buckets,
    trendUsers.filter((user) => user.role === USER_ROLES.EMPLOYER),
    "employers"
  );
  incrementBuckets(buckets, trendCompanies, "companies");
  incrementBuckets(buckets, trendJobs, "jobs");
  incrementBuckets(buckets, trendApplications, "applications");
  incrementBuckets(buckets, trendInterviews, "interviews");
  incrementBuckets(buckets, trendBlogs, "blogs");

  const categoryTotal = categoryRows.reduce((total, row) => total + row.count, 0);
  const locationTotal = locationRows.reduce((total, row) => total + row.count, 0);
  const submitted = totalApplications;
  const reviewed = funnelRows
    .filter((row) => ["under_review", "in_review", "reviewing", "shortlisted", "interview", "offered", "hired"].includes(String(row._id)))
    .reduce((total, row) => total + row.count, 0);
  const shortlisted = funnelRows
    .filter((row) => ["shortlisted", "interview", "offered", "hired"].includes(String(row._id)))
    .reduce((total, row) => total + row.count, 0);
  const offers = funnelRows
    .filter((row) => ["offered", "hired"].includes(String(row._id)))
    .reduce((total, row) => total + row.count, 0);
  const hires = funnelRows.find((row) => row._id === APPLICATION_STATUS.HIRED)?.count ?? 0;

  const kpis = [
    toKpi("totalUsers", "Total Users", totalUsers, previousUsers),
    toKpi("totalJobSeekers", "Total Job Seekers", totalJobSeekers, previousJobSeekers),
    toKpi("totalEmployers", "Total Employers", totalEmployers, previousEmployers),
    toKpi("totalCompanies", "Total Companies", totalCompanies, previousCompanies),
    toKpi("totalJobs", "Total Jobs", totalJobs, previousJobs),
    toKpi("activeJobs", "Active Jobs", activeJobs, previousActiveJobs),
    toKpi("totalApplications", "Total Applications", totalApplications, previousApplications),
    toKpi("totalInterviews", "Total Interviews", totalInterviews, previousInterviews),
    toKpi("totalBlogs", "Total Blogs", totalBlogs, previousBlogs),
    toKpi("totalCategories", "Total Categories", totalCategories, previousCategories),
  ];

  return {
    kpis,
    growthMetrics: kpis,
    trends: buckets.map(({ from, to, ...bucket }) => bucket),
    categoryDistribution: categoryRows.map((row) => ({
      label: row._id ?? "Uncategorized",
      count: row.count,
      percentage: categoryTotal > 0 ? Math.round((row.count / categoryTotal) * 100) : 0,
    })),
    locationDistribution: locationRows.map((row) => ({
      label: row._id ?? "Unspecified",
      count: row.count,
      percentage: locationTotal > 0 ? Math.round((row.count / locationTotal) * 100) : 0,
    })),
    hiringFunnel: [
      { label: "Applications Submitted", count: submitted, percentage: submitted > 0 ? 100 : 0 },
      { label: "Applications Reviewed", count: reviewed, percentage: submitted > 0 ? Math.round((reviewed / submitted) * 100) : 0 },
      { label: "Shortlisted", count: shortlisted, percentage: submitted > 0 ? Math.round((shortlisted / submitted) * 100) : 0 },
      { label: "Interviews Scheduled", count: totalInterviews, percentage: submitted > 0 ? Math.round((totalInterviews / submitted) * 100) : 0 },
      { label: "Offers Sent", count: offers, percentage: submitted > 0 ? Math.round((offers / submitted) * 100) : 0 },
      { label: "Hires Completed", count: hires, percentage: submitted > 0 ? Math.round((hires / submitted) * 100) : 0 },
    ],
    topCategories: topCategories.map((row) => ({
      category: row._id ?? "Uncategorized",
      jobs: row.jobs,
      activeJobs: row.activeJobs,
      applications: row.applications,
      companies: row.companies.length,
    })),
    topCompanies: topCompanies.map((row) => ({
      companyId: row._id?.toString(),
      company: row.company ?? "Unknown company",
      location: row.location,
      jobs: row.jobs,
      activeJobs: row.activeJobs,
      applications: row.applications,
    })),
    topEmployers: topEmployers.map((row) => ({
      employerId: row._id?.toString(),
      employer: row.employer ?? "Unknown employer",
      jobs: row.jobs,
      applications: row.applications,
    })),
    topJobs: topJobs.map((job) => ({
      jobId: job._id.toString(),
      title: job.title,
      company: job.companyName,
      category: job.category,
      location: job.location,
      applications: job.applicationsCount ?? 0,
      status: job.status,
    })),
    topJobSeekers: topJobSeekers.map((row) => ({
      jobSeekerId: row._id?.toString(),
      name: row.name ?? "Unknown job seeker",
      applications: row.applications,
    })),
    topBlogs: topBlogs.map((blog) => ({
      blogId: blog._id.toString(),
      title: blog.title,
      status: blog.status,
      views: blog.viewCount ?? 0,
      publishedAt: blog.publishedAt?.toISOString(),
    })),
    exports: {
      csv: false,
      excel: false,
      pdf: false,
    },
  };
};

export const getAdminAnalyticsUsers = async (query: AdminAnalyticsQuery) =>
  (await getAdminAnalyticsOverview(query)).trends;

export const getAdminAnalyticsEmployers = async (query: AdminAnalyticsQuery) =>
  (await getAdminAnalyticsOverview(query)).topEmployers;

export const getAdminAnalyticsJobs = async (query: AdminAnalyticsQuery) =>
  (await getAdminAnalyticsOverview(query)).topJobs;

export const getAdminAnalyticsApplications = async (query: AdminAnalyticsQuery) =>
  (await getAdminAnalyticsOverview(query)).hiringFunnel;

export const getAdminAnalyticsInterviews = async (query: AdminAnalyticsQuery) =>
  (await getAdminAnalyticsOverview(query)).trends;

export const getAdminAnalyticsBlogs = async (query: AdminAnalyticsQuery) =>
  (await getAdminAnalyticsOverview(query)).topBlogs;

export const getAdminAnalyticsCategories = async (query: AdminAnalyticsQuery) =>
  (await getAdminAnalyticsOverview(query)).topCategories;

export const listAdminReports = async (query: PaginationQuery) => {
  const filter: Record<string, unknown> = {};
  const regex = buildSearchRegex(query.search);

  if (query.status) filter.status = query.status;
  if (query.severity) filter.severity = query.severity;
  if (query.reason) filter.reason = query.reason;
  if (query.targetType) filter.targetType = query.targetType;
  if (query.assignedModerator && Types.ObjectId.isValid(query.assignedModerator)) {
    filter.assignedModeratorId = query.assignedModerator;
  }
  if (query.reporter) {
    const reporterRegex = buildSearchRegex(query.reporter);
    if (reporterRegex) {
      filter.$or = [
        { reporterName: reporterRegex },
        { reporterEmail: reporterRegex },
      ];
    }
  }
  if (query.dateFrom || query.dateTo) {
    const createdAt: Record<string, Date> = {};
    if (query.dateFrom) createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) {
      const dateTo = new Date(query.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      createdAt.$lte = dateTo;
    }
    filter.createdAt = createdAt;
  }
  if (regex) {
    const searchConditions = [
      { reporterName: regex },
      { reason: regex },
      { description: regex },
      { reporterEmail: regex },
      { targetType: regex },
      { targetLabel: regex },
    ];
    filter.$or = filter.$or
      ? [...(filter.$or as Array<Record<string, unknown>>), ...searchConditions]
      : searchConditions;
  }

  const skip = (query.page - 1) * query.limit;
  const [reports, total] = await Promise.all([
    Report.find(filter)
      .populate("reporterId", "name email")
      .populate("reviewedBy", "name email")
      .populate("assignedModeratorId", "name email")
      .sort(buildSort(query.sortBy))
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Report.countDocuments(filter),
  ]);

  return { reports, meta: getPaginationMeta(query.page, query.limit, total) };
};

export const getAdminReport = async (reportId: string) => {
  const report = await Report.findById(reportId)
    .populate("reporterId", "name email")
    .populate("reviewedBy", "name email")
    .populate("assignedModeratorId", "name email")
    .lean();

  if (!report) throw new AppError("Report not found", 404);

  return report;
};

export const updateAdminReportStatus = async (
  actor: AdminActor,
  reportId: string,
  input: { status: string; resolutionNote?: string; moderatorNote?: string }
) => {
  const resolvedStatuses = [
    REPORT_STATUS.RESOLVED,
    REPORT_STATUS.DISMISSED,
  ];
  const report = await Report.findByIdAndUpdate(
    reportId,
    {
      $set: {
        status: input.status as ReportStatus,
        resolutionNote: input.resolutionNote,
        moderatorNote: input.moderatorNote,
        reviewedBy: actor.id,
        assignedModeratorId: actor.id,
        resolvedAt: resolvedStatuses.includes(input.status as typeof resolvedStatuses[number])
          ? new Date()
          : undefined,
      },
    },
    { new: true, runValidators: true }
  );

  if (!report) throw new AppError("Report not found", 404);

  return report;
};

export const resolveAdminReport = async (
  actor: AdminActor,
  reportId: string,
  input: { moderatorNote?: string; resolutionNote?: string }
) =>
  updateAdminReportStatus(actor, reportId, {
    status: REPORT_STATUS.RESOLVED,
    moderatorNote: input.moderatorNote,
    resolutionNote: input.resolutionNote,
  });

export const dismissAdminReport = async (
  actor: AdminActor,
  reportId: string,
  input: { moderatorNote?: string; resolutionNote?: string }
) =>
  updateAdminReportStatus(actor, reportId, {
    status: REPORT_STATUS.DISMISSED,
    moderatorNote: input.moderatorNote,
    resolutionNote: input.resolutionNote,
  });

export const escalateAdminReport = async (
  actor: AdminActor,
  reportId: string,
  input: { moderatorNote?: string; resolutionNote?: string }
) =>
  updateAdminReportStatus(actor, reportId, {
    status: REPORT_STATUS.ESCALATED,
    moderatorNote: input.moderatorNote,
    resolutionNote: input.resolutionNote,
  });

export const getAdminReportAnalytics = async (query: PaginationQuery) => {
  const filter: Record<string, unknown> = {};
  if (query.dateFrom || query.dateTo) {
    const createdAt: Record<string, Date> = {};
    if (query.dateFrom) createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) {
      const dateTo = new Date(query.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      createdAt.$lte = dateTo;
    }
    filter.createdAt = createdAt;
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [severityRows, reasonRows, trends] = await Promise.all([
    Report.aggregate([
      { $match: filter },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]),
    Report.aggregate([
      { $match: filter },
      { $group: { _id: "$reason", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Report.aggregate([
      { $match: { ...filter, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const severityCounts = severityRows.reduce(
    (acc, row) => ({ ...acc, [row._id ?? "low"]: row.count }),
    { critical: 0, high: 0, medium: 0, low: 0 }
  );
  const reasonTotal = reasonRows.reduce((total, row) => total + row.count, 0);

  return {
    severityCounts,
    trends: trends.map((row) => ({ date: row._id, count: row.count })),
    reasonDistribution: reasonRows.map((row) => ({
      reason: row._id ?? "other",
      count: row.count,
      percentage: reasonTotal > 0 ? Math.round((row.count / reasonTotal) * 100) : 0,
    })),
  };
};

const getEnvironmentStats = () => ({
  frameworkVersion: process.version,
  apiLatencyMs: 0,
  lastReboot: new Date(Date.now() - process.uptime() * 1000).toISOString(),
  systemHealth: "operational",
  environment: process.env.NODE_ENV ?? "development",
});

const shapeSystemSettingsResponse = (document: Awaited<ReturnType<typeof SystemSettings.findOne>>) => {
  const settings = mergeSystemSettings(document ? {
    general: document.general as SystemSettingsInput["general"],
    platform: document.platform as SystemSettingsInput["platform"],
    authentication: document.authentication as SystemSettingsInput["authentication"],
    registration: document.registration as SystemSettingsInput["registration"],
    employerApproval: document.employerApproval as SystemSettingsInput["employerApproval"],
    jobApproval: document.jobApproval as SystemSettingsInput["jobApproval"],
    blog: document.blog as SystemSettingsInput["blog"],
    notifications: document.notifications as SystemSettingsInput["notifications"],
    email: document.email as SystemSettingsInput["email"],
    security: document.security as SystemSettingsInput["security"],
    seo: document.seo as SystemSettingsInput["seo"],
    analytics: document.analytics as SystemSettingsInput["analytics"],
  } : undefined);

  return {
    ...settings,
    auditLog: document?.auditLog?.slice(-10).reverse() ?? [],
    environment: getEnvironmentStats(),
    updatedAt: document?.updatedAt?.toISOString(),
  };
};

export const getAdminSystemSettings = async () => {
  const document = await SystemSettings.findOne({ key: "global" }).lean();
  return shapeSystemSettingsResponse(document as Awaited<ReturnType<typeof SystemSettings.findOne>>);
};

export const updateAdminSystemSettings = async (
  actor: AdminActor,
  input: SystemSettingsInput
) => {
  const nextSettings = mergeSystemSettings(input);
  const document = await SystemSettings.findOneAndUpdate(
    { key: "global" },
    {
      $set: {
        ...nextSettings,
      },
      $push: {
        auditLog: {
          $each: [
            {
              user: actor.id,
              userEmail: actor.email,
              action: "settings.updated",
              category: "system",
              summary: "Updated global system settings",
              createdAt: new Date(),
            },
          ],
          $slice: -50,
        },
      },
    },
    { upsert: true, new: true, runValidators: true }
  ).lean();

  return shapeSystemSettingsResponse(document as Awaited<ReturnType<typeof SystemSettings.findOne>>);
};

export const resetAdminSystemSettings = async (actor: AdminActor) => {
  const document = await SystemSettings.findOneAndUpdate(
    { key: "global" },
    {
      $set: {
        ...defaultSystemSettings,
      },
      $push: {
        auditLog: {
          $each: [
            {
              user: actor.id,
              userEmail: actor.email,
              action: "settings.reset",
              category: "system",
              summary: "Reset global system settings to defaults",
              createdAt: new Date(),
            },
          ],
          $slice: -50,
        },
      },
    },
    { upsert: true, new: true, runValidators: true }
  ).lean();

  return shapeSystemSettingsResponse(document as Awaited<ReturnType<typeof SystemSettings.findOne>>);
};

export const getAdminSystemSettingsCategories = async () => [
  "general",
  "platform",
  "authentication",
  "registration",
  "employerApproval",
  "jobApproval",
  "blog",
  "notifications",
  "email",
  "security",
  "seo",
  "analytics",
];
