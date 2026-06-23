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
    interviewType: z.enum(["online", "on_site", "phone", "video_call"]),
    interviewDate: z.string().min(1, "Interview date is required"),
    interviewTime: z.string().min(1, "Interview time is required"),
    meetingLink: z.string().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum([
      "scheduled",
      "confirmed",
      "completed",
      "rescheduled",
      "cancelled",
      "no_show",
    ]),
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
