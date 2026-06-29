import { z } from "zod";

export const emailPreferencesSchema = z.object({
  applicationSubmittedEmail: z.boolean(),
  applicationStatusChangedEmail: z.boolean(),
  interviewScheduledEmail: z.boolean(),
  employerApprovedEmail: z.boolean(),
  jobApprovedRejectedEmail: z.boolean(),
  newJobAlertEmail: z.boolean(),
});

export type EmailPreferencesFormValues = z.infer<typeof emailPreferencesSchema>;
