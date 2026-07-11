import { z } from "zod";

import {
  applicationStatusUpdateSchema,
  companyCreateSchema,
  companyUpdateSchema,
  employerApplicationsQuerySchema,
  employerApplicantsQuerySchema,
  employerJobsQuerySchema,
  employerSettingsSchema,
  jobCreateSchema,
  jobUpdateSchema,
} from "../validations/employer.validation.js";

export type CompanyCreateInput = z.infer<typeof companyCreateSchema>;
export type CompanyUpdateInput = z.infer<typeof companyUpdateSchema>;
export type JobCreateInput = z.infer<typeof jobCreateSchema>;
export type JobUpdateInput = z.infer<typeof jobUpdateSchema>;
export type EmployerJobsQuery = z.infer<typeof employerJobsQuerySchema>;
export type EmployerApplicantsQuery = z.infer<
  typeof employerApplicantsQuerySchema
>;
export type EmployerApplicationsQuery = z.infer<
  typeof employerApplicationsQuerySchema
>;
export type EmployerSettingsInput = z.infer<typeof employerSettingsSchema>;
export type ApplicationStatusUpdateInput = z.infer<
  typeof applicationStatusUpdateSchema
>;

export type AuthenticatedEmployer = {
  userId: string;
  email: string;
  firebaseUid: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
