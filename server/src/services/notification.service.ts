import type { DecodedIdToken } from "firebase-admin/auth";
import { Types } from "mongoose";

import {
  JOB_STATUS,
  NOTIFICATION_ENTITY_TYPE,
  NOTIFICATION_TYPE,
  USER_ROLES,
  type NotificationType,
  type JobStatus,
} from "../constants/model.constants.js";
import Application from "../models/application.model.js";
import Job, { type IJob } from "../models/job.model.js";
import JobAlert, { type IJobAlert } from "../models/jobAlert.model.js";
import JobSeeker from "../models/jobSeeker.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import type {
  CreateNotificationInput,
  NotificationRecipient,
  NotificationsQuery,
} from "../types/notification.types.js";

const toObjectId = (value: string | Types.ObjectId) =>
  typeof value === "string" ? new Types.ObjectId(value) : value;

const getPaginationMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
});

const isVisibleJobStatus = (status: JobStatus) =>
  status === JOB_STATUS.ACTIVE || status === JOB_STATUS.PUBLISHED;

const logNotificationError = (context: string, error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown notification error";
  console.error(`[notifications] ${context}: ${message}`);
};

const runNotificationEvent = async (
  context: string,
  task: () => Promise<void>
) => {
  try {
    await task();
  } catch (error) {
    logNotificationError(context, error);
  }
};

const normalizeText = (value?: string) => value?.trim().toLowerCase();

const includesText = (source?: string, query?: string) => {
  const normalizedSource = normalizeText(source);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return true;
  if (!normalizedSource) return false;

  return normalizedSource.includes(normalizedQuery);
};

const fieldMatches = (jobValue?: string, alertValue?: string) => {
  const normalizedAlert = normalizeText(alertValue);
  if (!normalizedAlert) return true;

  return normalizeText(jobValue) === normalizedAlert;
};

const keywordMatches = (job: Pick<IJob, "title" | "description" | "skills" | "companyName">, keyword?: string) => {
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return true;

  return [
    job.title,
    job.description,
    job.companyName,
    ...(job.skills ?? []),
  ].some((value) => includesText(value, normalizedKeyword));
};

const matchesJobAlert = (
  job: Pick<IJob, "title" | "description" | "skills" | "companyName" | "category" | "location" | "workMode" | "jobType" | "experienceLevel">,
  alert: IJobAlert
) => {
  return (
    keywordMatches(job, alert.keyword) &&
    fieldMatches(job.category, alert.category) &&
    includesText(job.location, alert.location) &&
    fieldMatches(job.workMode, alert.workMode) &&
    fieldMatches(job.jobType, alert.jobType)
  );
};

export const getAuthenticatedNotificationUser = async (
  firebaseUser?: DecodedIdToken
): Promise<NotificationRecipient> => {
  if (!firebaseUser?.email) {
    throw new AppError("Unauthorized: missing Firebase user", 401);
  }

  const user = await User.findOne({
    $or: [
      { firebaseUid: firebaseUser.uid },
      { email: firebaseUser.email.toLowerCase() },
    ],
  }).select("_id role");

  if (!user) {
    throw new AppError("User profile not found. Sync the Firebase user first.", 404);
  }

  return {
    id: user._id.toString(),
    role: user.role,
  };
};

export const createNotification = async (input: CreateNotificationInput) => {
  const recipientId = toObjectId(input.recipientId);
  const actorId = input.actorId ? toObjectId(input.actorId) : undefined;
  const entityId = toObjectId(input.entityId);

  return Notification.create({
    recipientId,
    recipientRole: input.recipientRole,
    actorId,
    type: input.type,
    title: input.title,
    message: input.message,
    entityType: input.entityType,
    entityId,
    link: input.link,
    read: false,
    metadata: input.metadata ?? {},
    userId: recipientId,
    isRead: false,
    relatedId: entityId,
  });
};

export const createManyNotifications = async (
  inputs: CreateNotificationInput[]
) => {
  if (inputs.length === 0) return [];

  const documents = inputs.map((input) => {
    const recipientId = toObjectId(input.recipientId);
    const actorId = input.actorId ? toObjectId(input.actorId) : undefined;
    const entityId = toObjectId(input.entityId);

    return {
      recipientId,
      recipientRole: input.recipientRole,
      actorId,
      type: input.type,
      title: input.title,
      message: input.message,
      entityType: input.entityType,
      entityId,
      link: input.link,
      read: false,
      metadata: input.metadata ?? {},
      userId: recipientId,
      isRead: false,
      relatedId: entityId,
    };
  });

  return Notification.insertMany(documents, { ordered: false });
};

export const createNotificationSafely = async (
  context: string,
  input: CreateNotificationInput
) => {
  try {
    await createNotification(input);
  } catch (error) {
    logNotificationError(context, error);
  }
};

export const createManyNotificationsSafely = async (
  context: string,
  inputs: CreateNotificationInput[]
) => {
  try {
    await createManyNotifications(inputs);
  } catch (error) {
    logNotificationError(context, error);
  }
};

export const getUserNotifications = async (
  recipient: NotificationRecipient,
  query: NotificationsQuery
) => {
  const recipientObjectId = new Types.ObjectId(recipient.id);
  const filter: Record<string, unknown> = {
    $or: [{ recipientId: recipientObjectId }, { userId: recipientObjectId }],
  };

  if (query.read !== undefined) {
    filter.$and = [
      {
        $or: [{ read: query.read }, { isRead: query.read }],
      },
    ];
  }

  if (query.type) {
    filter.type = query.type;
  }

  const skip = (query.page - 1) * query.limit;
  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    meta: getPaginationMeta(query.page, query.limit, total),
  };
};

export const getUnreadNotificationCount = async (
  recipient: NotificationRecipient
) => {
  const recipientObjectId = new Types.ObjectId(recipient.id);

  return Notification.countDocuments({
    $or: [{ recipientId: recipientObjectId }, { userId: recipientObjectId }],
    $and: [{ $or: [{ read: false }, { isRead: false }] }],
  });
};

export const markAsRead = async (
  recipient: NotificationRecipient,
  notificationId: string
) => {
  const recipientObjectId = new Types.ObjectId(recipient.id);
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      $or: [{ recipientId: recipientObjectId }, { userId: recipientObjectId }],
    },
    { $set: { read: true, isRead: true } },
    { returnDocument: "after", runValidators: true }
  );

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return notification;
};

export const markAllAsRead = async (recipient: NotificationRecipient) => {
  const recipientObjectId = new Types.ObjectId(recipient.id);
  const result = await Notification.updateMany(
    {
      $or: [{ recipientId: recipientObjectId }, { userId: recipientObjectId }],
      $and: [{ $or: [{ read: false }, { isRead: false }] }],
    },
    { $set: { read: true, isRead: true } }
  );

  return { modifiedCount: result.modifiedCount };
};

export const deleteNotification = async (
  recipient: NotificationRecipient,
  notificationId: string
) => {
  const recipientObjectId = new Types.ObjectId(recipient.id);
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    $or: [{ recipientId: recipientObjectId }, { userId: recipientObjectId }],
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return notification;
};

export const notifyApplicationSubmitted = async (applicationId: string) => {
  await runNotificationEvent("application submitted", async () => {
    const application = await Application.findById(applicationId)
      .populate("jobId", "title companyName")
      .lean();

    if (!application) return;

    const job = application.jobId as unknown as { _id: Types.ObjectId; title?: string };
    const jobTitle = job?.title ?? "a job";

    await createNotification({
      recipientId: application.employerId,
      recipientRole: USER_ROLES.EMPLOYER,
      actorId: application.applicantId,
      type: NOTIFICATION_TYPE.APPLICATION_SUBMITTED,
      title: "New application submitted",
      message: `${application.applicantName ?? "A candidate"} applied for ${jobTitle}.`,
      entityType: NOTIFICATION_ENTITY_TYPE.APPLICATION,
      entityId: application._id,
      link: `/employer/applications/${application._id.toString()}`,
      metadata: {
        jobId: application.jobId?._id?.toString() ?? application.jobId?.toString(),
        applicantName: application.applicantName,
        applicantEmail: application.applicantEmail,
      },
    });
  });
};

export const notifyApplicationStatusChanged = async (
  applicationId: string,
  actorId?: string | Types.ObjectId
) => {
  await runNotificationEvent("application status changed", async () => {
    const application = await Application.findById(applicationId)
      .populate("jobId", "title companyName")
      .lean();

    if (!application) return;

    const job = application.jobId as unknown as { _id: Types.ObjectId; title?: string };
    const jobTitle = job?.title ?? "your application";

    await createNotification({
      recipientId: application.applicantId,
      recipientRole: USER_ROLES.JOB_SEEKER,
      actorId,
      type: NOTIFICATION_TYPE.APPLICATION_STATUS_CHANGED,
      title: "Application status updated",
      message: `Your application for ${jobTitle} is now ${application.status}.`,
      entityType: NOTIFICATION_ENTITY_TYPE.APPLICATION,
      entityId: application._id,
      link: `/job-seeker/applications/${application._id.toString()}`,
      metadata: {
        jobId: application.jobId?._id?.toString() ?? application.jobId?.toString(),
        status: application.status,
      },
    });
  });
};

export const notifyInterviewScheduled = async (interviewId: string) => {
  await runNotificationEvent("interview scheduled", async () => {
    const interview = await import("../models/interview.model.js").then(({ default: Interview }) =>
      Interview.findById(interviewId).populate("jobId", "title").lean()
    );

    if (!interview) return;

    const job = interview.jobId as unknown as { _id: Types.ObjectId; title?: string };
    const jobTitle = job?.title ?? "your application";
    const dateTime = interview.dateTime.toISOString();

    await createManyNotifications([
      {
        recipientId: interview.applicantId,
        recipientRole: USER_ROLES.JOB_SEEKER,
        actorId: interview.employerId,
        type: NOTIFICATION_TYPE.INTERVIEW_SCHEDULED,
        title: "Interview scheduled",
        message: `An interview for ${jobTitle} has been scheduled.`,
        entityType: NOTIFICATION_ENTITY_TYPE.INTERVIEW,
        entityId: interview._id,
        link: `/job-seeker/interviews/${interview._id.toString()}`,
        metadata: { jobId: job?._id?.toString(), dateTime },
      },
      {
        recipientId: interview.employerId,
        recipientRole: USER_ROLES.EMPLOYER,
        actorId: interview.employerId,
        type: NOTIFICATION_TYPE.INTERVIEW_SCHEDULED,
        title: "Interview scheduled",
        message: `Your interview for ${jobTitle} has been scheduled.`,
        entityType: NOTIFICATION_ENTITY_TYPE.INTERVIEW,
        entityId: interview._id,
        link: `/employer/interviews/${interview._id.toString()}`,
        metadata: { jobId: job?._id?.toString(), dateTime },
      },
    ]);
  });
};

export const notifyEmployerApproved = async (
  employerId: string | Types.ObjectId,
  companyId: string | Types.ObjectId,
  actorId?: string | Types.ObjectId
) => {
  await runNotificationEvent("employer approved", async () => {
    await createNotification({
      recipientId: employerId,
      recipientRole: USER_ROLES.EMPLOYER,
      actorId,
      type: NOTIFICATION_TYPE.EMPLOYER_APPROVED,
      title: "Employer account approved",
      message: "Your employer account has been approved.",
      entityType: NOTIFICATION_ENTITY_TYPE.EMPLOYER,
      entityId: companyId,
      link: "/employer/company",
    });
  });
};

export const notifyJobApproved = async (jobId: string | Types.ObjectId) => {
  await runNotificationEvent("job approved", async () => {
    const job = await Job.findById(jobId).select("_id employerId title").lean();
    if (!job) return;

    await createNotification({
      recipientId: job.employerId,
      recipientRole: USER_ROLES.EMPLOYER,
      type: NOTIFICATION_TYPE.JOB_APPROVED,
      title: "Job approved",
      message: `${job.title} has been approved and is now visible to candidates.`,
      entityType: NOTIFICATION_ENTITY_TYPE.JOB,
      entityId: job._id,
      link: `/employer/jobs/${job._id.toString()}`,
    });
  });
};

export const notifyJobRejected = async (jobId: string | Types.ObjectId) => {
  await runNotificationEvent("job rejected", async () => {
    const job = await Job.findById(jobId).select("_id employerId title").lean();
    if (!job) return;

    await createNotification({
      recipientId: job.employerId,
      recipientRole: USER_ROLES.EMPLOYER,
      type: NOTIFICATION_TYPE.JOB_REJECTED,
      title: "Job rejected",
      message: `${job.title} was rejected by the review team.`,
      entityType: NOTIFICATION_ENTITY_TYPE.JOB,
      entityId: job._id,
      link: `/employer/jobs/${job._id.toString()}`,
    });
  });
};

export const notifyMatchingJobAlertsForJob = async (
  jobId: string | Types.ObjectId
) => {
  await runNotificationEvent("new job alert", async () => {
    const job = await Job.findById(jobId)
      .select("_id title description skills companyName category location workMode jobType experienceLevel status")
      .lean();

    if (!job || !isVisibleJobStatus(job.status)) {
      return;
    }

    const candidateAlerts = await JobAlert.find({
      isActive: true,
      $and: [
        { $or: [{ category: { $exists: false } }, { category: job.category }, { category: "" }] },
        { $or: [{ jobType: { $exists: false } }, { jobType: job.jobType }, { jobType: "" }] },
        { $or: [{ workMode: { $exists: false } }, { workMode: job.workMode }, { workMode: "" }] },
      ],
    })
      .select("_id jobSeekerId title keyword location category jobType workMode")
      .lean();

    const matchingAlerts = candidateAlerts.filter((alert) =>
      matchesJobAlert(job, alert)
    );

    if (matchingAlerts.length === 0) return;

    const jobSeekerIds = Array.from(
      new Set(matchingAlerts.map((alert) => alert.jobSeekerId.toString()))
    );
    const jobSeekers = await JobSeeker.find({ _id: { $in: jobSeekerIds } })
      .select("_id userId")
      .lean();
    const userByJobSeekerId = new Map(
      jobSeekers.map((jobSeeker) => [
        jobSeeker._id.toString(),
        jobSeeker.userId,
      ])
    );

    const inputs = matchingAlerts
      .map((alert): CreateNotificationInput | undefined => {
        const recipientId = userByJobSeekerId.get(alert.jobSeekerId.toString());
        if (!recipientId) return undefined;

        return {
          recipientId,
          recipientRole: USER_ROLES.JOB_SEEKER,
          type: NOTIFICATION_TYPE.NEW_JOB_ALERT as NotificationType,
          title: "New job matching your alert",
          message: `${job.title} matches your job alert ${alert.title}.`,
          entityType: NOTIFICATION_ENTITY_TYPE.JOB_ALERT,
          entityId: alert._id,
          link: `/jobs/${job._id.toString()}`,
          metadata: {
            jobId: job._id.toString(),
            jobTitle: job.title,
            alertTitle: alert.title,
          },
        } satisfies CreateNotificationInput;
      })
      .filter((input): input is CreateNotificationInput => input !== undefined);

    await createManyNotifications(inputs);
  });
};
