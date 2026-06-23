import type { DecodedIdToken } from "firebase-admin/auth";

import JobSeeker, { type IJobSeeker } from "../models/jobSeeker.model.js";
import Resume from "../models/resume.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
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
        education: [],
        experience: [],
        preferredJobTypes: [],
        preferredWorkModes: [],
      },
    },
    { new: true, upsert: true, runValidators: true }
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

  return profile;
};

export const updateMyJobSeekerProfile = async (
  jobSeeker: AuthenticatedJobSeeker,
  input: ProfileUpdateInput
) => {
  const update: Partial<IJobSeeker> = { ...input } as Partial<IJobSeeker>;

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

  return profile;
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
