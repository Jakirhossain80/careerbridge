import type { DecodedIdToken } from "firebase-admin/auth";
import type { Types } from "mongoose";

import Application from "../models/application.model.js";
import Interview from "../models/interview.model.js";
import JobSeeker, { type IJobSeeker } from "../models/jobSeeker.model.js";
import Resume from "../models/resume.model.js";
import SavedJob from "../models/savedJob.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { uploadImageBuffer } from "../utils/imageUpload.js";
import type {
  ProfileUpdateInput,
  ResumeUploadInput,
} from "../validations/jobSeeker.validation.js";

export type AuthenticatedJobSeeker = {
  userId: string;
  jobSeekerId: string;
  email: string;
  firebaseUid: string;
  name: string;
};

const defaultNotificationPreferences = {
  enableNotifications: true,
  emailNotifications: true,
  applicationUpdates: true,
  interviewNotifications: true,
  interviewReminders: true,
  jobAlerts: true,
  recommendedJobs: true,
};

const defaultPrivacySettings = {
  profileVisibility: "recruiters_only" as const,
  resumeVisibility: "recruiters_only" as const,
  contactInfoVisible: true,
  publicSearchVisible: true,
};

type JobSeekerProfileDocument = IJobSeeker & {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

const toIsoString = (value?: Date) => value?.toISOString();

const calculateProfileCompletion = (profile: IJobSeeker) => {
  if (typeof profile.profileCompletion === "number") {
    return profile.profileCompletion;
  }

  const checks = [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.location,
    profile.headline,
    profile.about,
    profile.currentDesignation,
    profile.preferredRole,
    profile.technicalSkills?.length || profile.skills?.length,
    profile.softSkills?.length,
    profile.experience?.length,
    profile.education?.length,
    profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const shapeProfileResponse = async (profile: JobSeekerProfileDocument) => {
  const defaultResume = await Resume.findOne({
    jobSeekerId: profile._id,
    isDefault: true,
  })
    .sort({ uploadedAt: -1 })
    .lean();

  const technicalSkills =
    profile.technicalSkills?.length ? profile.technicalSkills : profile.skills ?? [];

  return {
    _id: profile._id.toString(),
    userId: profile.userId.toString(),
    firebaseUid: profile.firebaseUid,
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    avatar: profile.avatar,
    coverImage: profile.coverImage,
    headline: profile.headline,
    location: profile.location,
    joinedAt: toIsoString(profile.createdAt),
    profileCompletion: calculateProfileCompletion(profile),
    about: profile.about,
    yearsOfExperience: profile.yearsOfExperience,
    currentDesignation: profile.currentDesignation ?? profile.experienceLevel,
    preferredRole:
      profile.preferredRole ??
      profile.preferredJobTypes?.[0] ??
      profile.preferredCategories?.[0],
    technicalSkills,
    softSkills: profile.softSkills ?? [],
    skills: profile.skills ?? technicalSkills,
    experienceLevel: profile.experienceLevel,
    education: profile.education ?? [],
    experience: profile.experience ?? [],
    projects: profile.projects ?? [],
    resume: defaultResume
      ? {
          _id: defaultResume._id.toString(),
          fileName: defaultResume.fileName,
          fileUrl: defaultResume.fileUrl,
          uploadedAt: defaultResume.uploadedAt.toISOString(),
          isDefault: defaultResume.isDefault,
        }
      : undefined,
    portfolioUrl: profile.portfolioUrl,
    linkedinUrl: profile.linkedinUrl,
    githubUrl: profile.githubUrl,
    otherLinks: profile.otherLinks ?? [],
    preferredJobTypes: profile.preferredJobTypes ?? [],
    preferredWorkModes: profile.preferredWorkModes ?? [],
    preferredCategories: profile.preferredCategories ?? [],
    preferredLocations: profile.preferredLocations ?? [],
    expectedSalaryMin: profile.expectedSalaryMin,
    expectedSalaryMax: profile.expectedSalaryMax,
    notificationPreferences: {
      ...defaultNotificationPreferences,
      ...profile.notificationPreferences,
    },
    privacySettings: {
      ...defaultPrivacySettings,
      ...profile.privacySettings,
    },
    language: profile.language ?? "en",
    timeZone: profile.timeZone ?? "Asia/Dhaka",
    linkedProfiles: profile.linkedProfiles ?? [],
    createdAt: toIsoString(profile.createdAt),
    updatedAt: toIsoString(profile.updatedAt),
  };
};

const shapeSettingsResponse = (profile: JobSeekerProfileDocument) => ({
  _id: profile._id.toString(),
  userId: profile.userId.toString(),
  accountPreferences: {
    currentEmail: profile.email,
    newEmail: "",
    phone: profile.phone,
    linkedProfiles: profile.linkedProfiles ?? [],
    language: profile.language ?? "en",
    timeZone: profile.timeZone ?? "Asia/Dhaka",
  },
  notificationPreferences: {
    ...defaultNotificationPreferences,
    ...profile.notificationPreferences,
  },
  privacySettings: {
    ...defaultPrivacySettings,
    ...profile.privacySettings,
  },
  jobPreferences: {
    preferredCategories: profile.preferredCategories ?? [],
    preferredLocations: profile.preferredLocations ?? [],
    preferredEmploymentTypes: profile.preferredJobTypes ?? [],
    preferredWorkModes: profile.preferredWorkModes ?? [],
    expectedSalaryMin: profile.expectedSalaryMin,
    expectedSalaryMax: profile.expectedSalaryMax,
  },
  updatedAt: toIsoString(profile.updatedAt),
});

export const getAuthenticatedJobSeeker = async (
  firebaseUser?: DecodedIdToken
): Promise<AuthenticatedJobSeeker> => {
  if (!firebaseUser) {
    throw new AppError("Unauthorized: missing Firebase user", 401);
  }

  if (!firebaseUser.email) {
    throw new AppError("Firebase user email is required", 400);
  }

  const user = await User.findOne({
    $or: [
      { firebaseUid: firebaseUser.uid },
      { email: firebaseUser.email.toLowerCase() },
    ],
  });

  if (!user) {
    throw new AppError("User profile not found. Sync the Firebase user first.", 404);
  }

  const profile = await JobSeeker.findOneAndUpdate(
    { userId: user._id },
    {
      $setOnInsert: {
        userId: user._id,
        firebaseUid: user.firebaseUid,
        fullName: user.name,
        email: user.email,
        avatar: user.photoURL,
        skills: [],
        technicalSkills: [],
        softSkills: [],
        education: [],
        experience: [],
        projects: [],
        preferredJobTypes: [],
        preferredWorkModes: [],
        preferredCategories: [],
        preferredLocations: [],
        linkedProfiles: [],
        notificationPreferences: defaultNotificationPreferences,
        privacySettings: defaultPrivacySettings,
      },
    },
    { returnDocument: "after", upsert: true, runValidators: true }
  );

  return {
    userId: user._id.toString(),
    jobSeekerId: profile._id.toString(),
    email: user.email,
    firebaseUid: user.firebaseUid,
    name: user.name,
  };
};

export const getMyJobSeekerProfile = async (jobSeeker: AuthenticatedJobSeeker) => {
  const profile = await JobSeeker.findById(jobSeeker.jobSeekerId);

  if (!profile) {
    throw new AppError("Job seeker profile not found", 404);
  }

  return shapeProfileResponse(profile);
};

export const updateMyJobSeekerProfile = async (
  jobSeeker: AuthenticatedJobSeeker,
  input: ProfileUpdateInput
) => {
  const update: Partial<IJobSeeker> = { ...input } as Partial<IJobSeeker>;

  if (input.technicalSkills && !input.skills) {
    update.skills = input.technicalSkills;
  }

  const profile = await JobSeeker.findByIdAndUpdate(
    jobSeeker.jobSeekerId,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new AppError("Job seeker profile not found", 404);
  }

  await User.findByIdAndUpdate(jobSeeker.userId, {
    $set: {
      name: profile.fullName,
      email: profile.email,
      photoURL: profile.avatar,
      profileCompleted: true,
    },
  });

  return shapeProfileResponse(profile);
};

export const uploadMyJobSeekerAvatar = async (
  jobSeeker: AuthenticatedJobSeeker,
  file: Express.Multer.File
) => {
  const uploadResult = await uploadImageBuffer(file.buffer, {
    folder: "careerbridge/job-seeker-avatars",
    publicId: `${jobSeeker.firebaseUid}-${Date.now()}`,
    transformation: [
      { width: 512, height: 512, crop: "fill", gravity: "face" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });

  const profile = await JobSeeker.findByIdAndUpdate(
    jobSeeker.jobSeekerId,
    { $set: { avatar: uploadResult.secure_url } },
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new AppError("Job seeker profile not found", 404);
  }

  await User.findByIdAndUpdate(jobSeeker.userId, {
    $set: {
      photoURL: profile.avatar,
    },
  });

  return shapeProfileResponse(profile);
};

export const getMyJobSeekerProfileStats = async (
  jobSeeker: AuthenticatedJobSeeker
) => {
  const [appliedJobs, savedJobs, interviews] = await Promise.all([
    Application.countDocuments({ applicantId: jobSeeker.userId }),
    SavedJob.countDocuments({ userId: jobSeeker.userId }),
    Interview.countDocuments({ applicantId: jobSeeker.userId }),
  ]);

  return {
    appliedJobs,
    savedJobs,
    interviews,
    profileViews: 0,
  };
};

export const getMyJobSeekerSettings = async (
  jobSeeker: AuthenticatedJobSeeker
) => {
  const profile = await JobSeeker.findById(jobSeeker.jobSeekerId);

  if (!profile) {
    throw new AppError("Job seeker profile not found", 404);
  }

  return shapeSettingsResponse(profile);
};

export const updateMyJobSeekerSettings = async (
  jobSeeker: AuthenticatedJobSeeker,
  input: ProfileUpdateInput
) => {
  const profile = await JobSeeker.findByIdAndUpdate(
    jobSeeker.jobSeekerId,
    { $set: input },
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new AppError("Job seeker profile not found", 404);
  }

  await User.findByIdAndUpdate(jobSeeker.userId, {
    $set: {
      email: profile.email,
      photoURL: profile.avatar,
    },
  });

  return shapeSettingsResponse(profile);
};

export const createResume = async (
  jobSeeker: AuthenticatedJobSeeker,
  input: ResumeUploadInput
) => {
  const shouldSetDefault =
    input.isDefault ||
    (await Resume.countDocuments({ jobSeekerId: jobSeeker.jobSeekerId })) === 0;

  if (shouldSetDefault) {
    await Resume.updateMany(
      { jobSeekerId: jobSeeker.jobSeekerId },
      { $set: { isDefault: false } }
    );
  }

  return Resume.create({
    jobSeekerId: jobSeeker.jobSeekerId,
    fileName: input.fileName,
    fileUrl: input.fileUrl,
    fileType: input.fileType,
    fileSize: input.fileSize,
    isDefault: shouldSetDefault,
    uploadedAt: new Date(),
  });
};

export const getMyResumes = async (jobSeeker: AuthenticatedJobSeeker) => {
  return Resume.find({ jobSeekerId: jobSeeker.jobSeekerId })
    .sort({ isDefault: -1, uploadedAt: -1 })
    .lean();
};

export const setDefaultResume = async (
  jobSeeker: AuthenticatedJobSeeker,
  resumeId: string
) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    jobSeekerId: jobSeeker.jobSeekerId,
  });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  await Resume.updateMany(
    { jobSeekerId: jobSeeker.jobSeekerId },
    { $set: { isDefault: false } }
  );

  resume.isDefault = true;
  await resume.save();

  return resume;
};

export const deleteResume = async (
  jobSeeker: AuthenticatedJobSeeker,
  resumeId: string
) => {
  const resume = await Resume.findOneAndDelete({
    _id: resumeId,
    jobSeekerId: jobSeeker.jobSeekerId,
  });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  if (resume.isDefault) {
    const nextResume = await Resume.findOne({ jobSeekerId: jobSeeker.jobSeekerId })
      .sort({ uploadedAt: -1 });

    if (nextResume) {
      nextResume.isDefault = true;
      await nextResume.save();
    }
  }

  return resume;
};
