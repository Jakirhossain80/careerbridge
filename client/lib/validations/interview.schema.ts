import { z } from "zod";

export const interviewSchema = z
  .object({
    applicationId: z.string().min(1, "Application is required"),
    jobId: z.string().min(1, "Job is required"),
    candidateId: z.string().min(1, "Candidate is required"),
    candidateName: z.string().optional(),
    candidateEmail: z.string().optional(),
    candidateAvatar: z.string().optional(),
    jobTitle: z.string().min(1, "Job title is required"),
    interviewerName: z.string().min(2, "Interviewer name is required"),
    interviewType: z.enum(
      ["online", "on_site", "phone", "video_call"],
      "Please select an interview type",
    ),
    interviewDate: z.string().min(1, "Interview date is required"),
    interviewTime: z.string().min(1, "Interview time is required"),
    meetingLink: z.string().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(
      [
        "scheduled",
        "confirmed",
        "completed",
        "rescheduled",
        "cancelled",
        "no_show",
      ],
      "Please select an interview status",
    ),
  })
  .superRefine((data, context) => {
    if (
      (data.interviewType === "online" ||
        data.interviewType === "video_call") &&
      !data.meetingLink?.trim()
    ) {
      context.addIssue({
        code: "custom",
        path: ["meetingLink"],
        message: "Meeting link is required for online or video call interviews",
      });
    }

    if (data.interviewType === "on_site" && !data.location?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["location"],
        message: "Location is required for on-site interviews",
      });
    }
  });

export type InterviewFormValues = z.infer<typeof interviewSchema>;

export const interviewFeedbackSchema = z.object({
  technicalSkillsScore: z
    .number()
    .min(1, "Technical skills score must be at least 1")
    .max(5, "Technical skills score must be 5 or less"),
  cultureFitScore: z
    .number()
    .min(1, "Culture fit score must be at least 1")
    .max(5, "Culture fit score must be 5 or less"),
  communicationScore: z
    .number()
    .min(1, "Communication score must be at least 1")
    .max(5, "Communication score must be 5 or less")
    .optional(),
  problemSolvingScore: z
    .number()
    .min(1, "Problem solving score must be at least 1")
    .max(5, "Problem solving score must be 5 or less")
    .optional(),
  notes: z.string().min(10, "Feedback notes must be at least 10 characters"),
  recommendation: z
    .enum(
      ["strong_yes", "yes", "maybe", "no", "strong_no"],
      "Please select a recommendation",
    )
    .optional(),
});

export type InterviewFeedbackFormValues = z.infer<
  typeof interviewFeedbackSchema
>;

export const interviewRescheduleSchema = z.object({
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  reason: z.string().min(8, "Reason must be at least 8 characters"),
  note: z.string().optional(),
});

export type InterviewRescheduleFormValues = z.infer<
  typeof interviewRescheduleSchema
>;
