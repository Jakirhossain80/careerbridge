import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IJobSeekerEducation {
  degree?: string;
  institution?: string;
  graduationYear?: number;
}

export interface IJobSeekerExperience {
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
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
  skills: string[];
  experienceLevel?: string;
  education: IJobSeekerEducation[];
  experience: IJobSeekerExperience[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  preferredJobTypes: string[];
  preferredWorkModes: string[];
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const educationSchema = new Schema<IJobSeekerEducation>(
  {
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    graduationYear: { type: Number },
  },
  { _id: false }
);

const experienceSchema = new Schema<IJobSeekerExperience>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    currentlyWorking: { type: Boolean, default: false },
    description: { type: String, trim: true },
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
    skills: { type: [String], default: [], index: true },
    experienceLevel: { type: String, trim: true },
    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    portfolioUrl: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    preferredJobTypes: { type: [String], default: [] },
    preferredWorkModes: { type: [String], default: [] },
    expectedSalaryMin: { type: Number },
    expectedSalaryMax: { type: Number },
  },
  { timestamps: true }
);

export const JobSeeker =
  (models.JobSeeker as Model<IJobSeeker> | undefined) ??
  model<IJobSeeker>("JobSeeker", jobSeekerSchema);

export default JobSeeker;
