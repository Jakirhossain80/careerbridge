export type ResumeStatus = "uploaded" | "missing" | "processing" | "active";

export type ResumeFileType = "pdf" | "doc" | "docx";

export type ResumeInsightTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "neutral";

export interface ResumeFile {
  _id: string;
  jobSeekerId: string;
  fileName: string;
  fileUrl?: string;
  fileType: ResumeFileType;
  mimeType?: string;
  fileSize: number;
  status: ResumeStatus;
  isDefault?: boolean;
  uploadedAt: string;
  updatedAt?: string;
  version?: number;
}

export interface ResumeManagerPerformance {
  score?: number;
  label?: string;
  summary?: string;
}

export interface ResumeManagerInsight {
  title: string;
  description: string;
  tone?: ResumeInsightTone;
}

export interface ResumeManagerData {
  activeResume?: ResumeFile;
  resumes: ResumeFile[];
  versionHistory?: ResumeFile[];
  performance?: ResumeManagerPerformance;
  insights?: ResumeManagerInsight[];
  profileCompletion?: number;
  resumeCompletionStatus?: string;
  lastResumeUpdate?: string;
}

export type ResumeUploadPayload = FormData;
