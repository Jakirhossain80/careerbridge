import mongoose, { Schema, model, type Model, type Types } from "mongoose";

export interface IJobSeekerEducation {
  _id?: string;
  degree?: string;
  institution?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  startYear?: number;
  endYear?: number;
}

export interface IJobSeekerExperience {
  _id?: string;
  title: string;
  company: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  location?: string;
  description?: string;
}

export interface IJobSeekerProject {
  _id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies?: string[];
}

export type ProfileVisibility = "public" | "recruiters_only" | "private";

export interface IJobSeekerNotificationPreferences {
  enableNotifications: boolean;
  emailNotifications: boolean;
  applicationUpdates: boolean;
  interviewNotifications: boolean;
  interviewReminders: boolean;
  jobAlerts: boolean;
  recommendedJobs: boolean;
}

export interface IJobSeekerPrivacySettings {
  profileVisibility: ProfileVisibility;
  resumeVisibility: ProfileVisibility;
  contactInfoVisible: boolean;
  publicSearchVisible: boolean;
}

export interface IJobSeekerLinkedProfile {
  provider: string;
  email?: string;
}

export interface IJobSeeker {
  userId: Types.ObjectId;
  firebaseUid: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  location?: string;
  headline?: string;
  about?: string;
  coverImage?: string;
  profileCompletion?: number;
  yearsOfExperience?: number;
  currentDesignation?: string;
  preferredRole?: string;
  skills: string[];
  technicalSkills: string[];
  softSkills: string[];
  experienceLevel?: string;
  education: IJobSeekerEducation[];
  experience: IJobSeekerExperience[];
  projects: IJobSeekerProject[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  otherLinks?: Array<{
    label: string;
    url: string;
  }>;
  preferredJobTypes: string[];
  preferredWorkModes: string[];
  preferredCategories: string[];
  preferredLocations: string[];
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  language?: string;
  timeZone?: string;
  linkedProfiles: IJobSeekerLinkedProfile[];
  notificationPreferences: IJobSeekerNotificationPreferences;
  privacySettings: IJobSeekerPrivacySettings;
  createdAt?: Date;
  updatedAt?: Date;
}

const educationSchema = new Schema<IJobSeekerEducation>(
  {
    _id: { type: String, trim: true },
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    graduationYear: { type: Number },
    startYear: { type: Number },
    endYear: { type: Number },
  },
  { _id: false }
);

const experienceSchema = new Schema<IJobSeekerExperience>(
  {
    _id: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    employmentType: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    currentlyWorking: { type: Boolean, default: false },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const projectSchema = new Schema<IJobSeekerProject>(
  {
    _id: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String },
    projectUrl: { type: String },
    githubUrl: { type: String },
    technologies: { type: [String], default: [] },
  },
  { _id: false }
);

const linkedProfileSchema = new Schema<IJobSeekerLinkedProfile>(
  {
    provider: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
  },
  { _id: false }
);

const notificationPreferencesSchema =
  new Schema<IJobSeekerNotificationPreferences>(
    {
      enableNotifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      interviewNotifications: { type: Boolean, default: true },
      interviewReminders: { type: Boolean, default: true },
      jobAlerts: { type: Boolean, default: true },
      recommendedJobs: { type: Boolean, default: true },
    },
    { _id: false }
  );

const privacySettingsSchema = new Schema<IJobSeekerPrivacySettings>(
  {
    profileVisibility: {
      type: String,
      enum: ["public", "recruiters_only", "private"],
      default: "recruiters_only",
    },
    resumeVisibility: {
      type: String,
      enum: ["public", "recruiters_only", "private"],
      default: "recruiters_only",
    },
    contactInfoVisible: { type: Boolean, default: true },
    publicSearchVisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const jobSeekerSchema = new Schema<IJobSeeker>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    firebaseUid: { type: String, required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    avatar: { type: String },
    location: { type: String, trim: true },
    headline: { type: String, trim: true },
    about: { type: String, trim: true },
    coverImage: { type: String },
    profileCompletion: { type: Number, min: 0, max: 100 },
    yearsOfExperience: { type: Number, min: 0 },
    currentDesignation: { type: String, trim: true },
    preferredRole: { type: String, trim: true },
    skills: { type: [String], default: [], index: true },
    technicalSkills: { type: [String], default: [] },
    softSkills: { type: [String], default: [] },
    experienceLevel: { type: String, trim: true },
    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    portfolioUrl: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    otherLinks: {
      type: [
        new Schema(
          {
            label: { type: String, required: true, trim: true },
            url: { type: String, required: true },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    preferredJobTypes: { type: [String], default: [] },
    preferredWorkModes: { type: [String], default: [] },
    preferredCategories: { type: [String], default: [] },
    preferredLocations: { type: [String], default: [] },
    expectedSalaryMin: { type: Number },
    expectedSalaryMax: { type: Number },
    language: { type: String, trim: true, default: "en" },
    timeZone: { type: String, trim: true, default: "Asia/Dhaka" },
    linkedProfiles: { type: [linkedProfileSchema], default: [] },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({}),
    },
    privacySettings: {
      type: privacySettingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export const JobSeeker =
  (mongoose.models.JobSeeker as Model<IJobSeeker> | undefined) ??
  model<IJobSeeker>("JobSeeker", jobSeekerSchema);

export default JobSeeker;
