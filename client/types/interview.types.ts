export type InterviewType = "online" | "on_site" | "phone" | "video_call";

export type InterviewStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "rescheduled"
  | "cancelled"
  | "no_show";

export type InterviewSortBy = "dateAsc" | "dateDesc" | "candidate" | "jobTitle";

export type InterviewViewMode = "list" | "calendar";

export type InterviewFiltersParams = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  jobTitle?: string;
  status?: InterviewStatus | "all";
  interviewType?: InterviewType | "all";
  sortBy?: InterviewSortBy;
  page?: number;
  limit?: number;
};

export interface Interview {
  _id: string;
  applicationId: string;
  jobId: string;
  employerId: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateAvatar?: string;
  jobTitle?: string;
  interviewerName: string;
  interviewType: InterviewType;
  interviewDate: string;
  interviewTime: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewDetails extends Interview {
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateAvatar?: string;
  candidateLocation?: string;
  candidateSkills?: string[];
  candidateSummary?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  jobTitle: string;
  department?: string;
  employmentType?: string;
  jobLocation?: string;
  hiringManager?: string;
  applicationStatus?: string;
  interviewerAvatar?: string;
  interviewerTitle?: string;
  duration?: number;
}

export type InterviewPayload = {
  applicationId: string;
  jobId: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateAvatar?: string;
  jobTitle?: string;
  interviewerName: string;
  interviewType: InterviewType;
  interviewDate: string;
  interviewTime: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
  status: InterviewStatus;
};

export type InterviewFeedbackPayload = {
  technicalSkillsScore: number;
  cultureFitScore: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  notes: string;
  recommendation?: "strong_yes" | "yes" | "maybe" | "no" | "strong_no";
};

export type EmployerInterviewsMeta = {
  totalThisMonth: number;
  completedThisMonth: number;
  upcomingToday: number;
  cancelledThisMonth: number;
  jobTitles: string[];
};

export type EmployerInterviewsResponse = {
  interviews: Interview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  meta: EmployerInterviewsMeta;
};

export const interviewTypeLabels: Record<InterviewType, string> = {
  online: "Online",
  on_site: "On-site",
  phone: "Phone",
  video_call: "Video Call",
};

export const interviewStatusLabels: Record<InterviewStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
  no_show: "No Show",
};
