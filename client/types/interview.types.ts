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

export type JobSeekerInterviewPeriod = "upcoming" | "past" | "all";

export type JobSeekerInterviewSortBy =
  | "upcoming_first"
  | "newest_invitation"
  | "oldest_invitation";

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

export type JobSeekerInterview = Pick<
  Interview,
  | "_id"
  | "applicationId"
  | "jobId"
  | "interviewerName"
  | "interviewType"
  | "interviewDate"
  | "interviewTime"
  | "meetingLink"
  | "location"
  | "notes"
  | "status"
  | "createdAt"
  | "updatedAt"
> & {
  companyId?: string;
  companyName: string;
  companyLogo?: string;
  jobTitle: string;
  interviewEndTime?: string;
  invitedAt?: string;
  feedbackAvailable?: boolean;
  feedbackSummary?: string;
};

export type JobSeekerInterviewFiltersParams = {
  search?: string;
  status?: InterviewStatus | "all";
  interviewType?: InterviewType | "all";
  period?: JobSeekerInterviewPeriod;
  sortBy?: JobSeekerInterviewSortBy;
  page?: number;
  limit?: number;
};

export type JobSeekerInterviewsMeta = {
  upcoming: number;
  completed: number;
  successRate: number;
  rescheduleRequests: number;
};

export type JobSeekerInterviewsResponse = {
  interviews: JobSeekerInterview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  meta: JobSeekerInterviewsMeta;
};

export type InterviewConfirmationPayload = {
  confirmed: boolean;
  note?: string;
};

export type InterviewReschedulePayload = {
  preferredDate: string;
  preferredTime: string;
  reason: string;
  note?: string;
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
