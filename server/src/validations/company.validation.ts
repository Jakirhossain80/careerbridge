import { z } from "zod";

const companyIdentifierSchema = z.string().trim().min(1);

export const companyIdentifierParamsSchema = z.object({
  companyId: companyIdentifierSchema,
});
