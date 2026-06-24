import type { DecodedIdToken } from "firebase-admin/auth";
import { Types, type SortOrder } from "mongoose";

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
import Report from "../models/report.model.js";
import User, { type IUser } from "../models/user.model.js";

type PaginationQuery = {
  search?: string;
  role?: string;
  status?: string;
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

  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (regex) filter.$or = [{ name: regex }, { email: regex }];

  const skip = (query.page - 1) * query.limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort(buildSort(query.sortBy)).skip(skip).limit(query.limit).lean(),
    User.countDocuments(filter),
  ]);

  return { users, meta: getPaginationMeta(query.page, query.limit, total) };
};

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
  return Blog.create({ ...input, slug, author: actor.id });
};

export const updateAdminBlog = async (blogId: string, input: Partial<IBlog>) => {
  const update = { ...input };
  if (input.title && !input.slug) {
    update.slug = await generateUniqueSlug(Blog, input.title, blogId);
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
  updateAdminBlog(blogId, { status: BLOG_STATUS.DRAFT as BlogStatus });

export const listAdminReports = async (query: PaginationQuery) => {
  const filter: Record<string, unknown> = {};
  const regex = buildSearchRegex(query.search);

  if (query.status) filter.status = query.status;
  if (regex) {
    filter.$or = [
      { reason: regex },
      { description: regex },
      { reporterEmail: regex },
      { targetType: regex },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [reports, total] = await Promise.all([
    Report.find(filter)
      .populate("reporterId", "name email")
      .populate("reviewedBy", "name email")
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
    .lean();

  if (!report) throw new AppError("Report not found", 404);

  return report;
};

export const updateAdminReportStatus = async (
  actor: AdminActor,
  reportId: string,
  input: { status: string; resolutionNote?: string }
) => {
  const report = await Report.findByIdAndUpdate(
    reportId,
    {
      $set: {
        status: input.status as ReportStatus,
        resolutionNote: input.resolutionNote,
        reviewedBy: actor.id,
      },
    },
    { new: true, runValidators: true }
  );

  if (!report) throw new AppError("Report not found", 404);

  return report;
};
