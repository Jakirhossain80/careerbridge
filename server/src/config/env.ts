import "dotenv/config";
import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

export const serverEnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  CLIENT_URL: z.url().default("http://localhost:3000"),
  MONGODB_URI: z
    .string()
    .min(1)
    .refine(
      (value) =>
        value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
      { message: "must use the mongodb:// or mongodb+srv:// protocol" }
    ),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  JWT_SECRET: optionalString,
  JWT_EXPIRES_IN: optionalString,
  CLOUDINARY_CLOUD_NAME: optionalString,
  CLOUDINARY_API_KEY: optionalString,
  CLOUDINARY_API_SECRET: optionalString,
  CLOUDINARY_UPLOAD_FOLDER: z.string().min(1).default("careerbridge"),
  JSON_BODY_LIMIT: z.string().min(1).default("1mb"),
  AVATAR_UPLOAD_MAX_MB: z.coerce.number().positive().max(25).default(5),
  COMPANY_LOGO_UPLOAD_MAX_MB: z.coerce.number().positive().max(25).default(5),
  COMPANY_BANNER_UPLOAD_MAX_MB: z.coerce.number().positive().max(25).default(8),
  RESUME_UPLOAD_MAX_MB: z.coerce.number().positive().max(25).default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(300),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(10).default(0),
});

export const parseServerEnv = (environment: NodeJS.ProcessEnv) => {
  const result = serverEnvSchema.safeParse(environment);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => {
      const variableName = issue.path.join(".") || "environment";
      return `${variableName}: ${issue.message}`;
    });

    throw new Error(
      `Invalid server environment configuration:\n- ${issues.join("\n- ")}`
    );
  }

  return result.data;
};

const parsedEnv = parseServerEnv(process.env);

const env = {
  port: parsedEnv.PORT,
  nodeEnv: parsedEnv.NODE_ENV,
  clientUrl: parsedEnv.CLIENT_URL,
  mongoUri: parsedEnv.MONGODB_URI,
  firebaseProjectId: parsedEnv.FIREBASE_PROJECT_ID,
  firebaseClientEmail: parsedEnv.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: parsedEnv.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  jwtSecret: parsedEnv.JWT_SECRET,
  jwtExpiresIn: parsedEnv.JWT_EXPIRES_IN,
  cloudinaryCloudName: parsedEnv.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: parsedEnv.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: parsedEnv.CLOUDINARY_API_SECRET,
  cloudinaryUploadFolder: parsedEnv.CLOUDINARY_UPLOAD_FOLDER,
  jsonBodyLimit: parsedEnv.JSON_BODY_LIMIT,
  avatarUploadMaxBytes: parsedEnv.AVATAR_UPLOAD_MAX_MB * 1024 * 1024,
  companyLogoUploadMaxBytes:
    parsedEnv.COMPANY_LOGO_UPLOAD_MAX_MB * 1024 * 1024,
  companyBannerUploadMaxBytes:
    parsedEnv.COMPANY_BANNER_UPLOAD_MAX_MB * 1024 * 1024,
  resumeUploadMaxBytes: parsedEnv.RESUME_UPLOAD_MAX_MB * 1024 * 1024,
  rateLimitWindowMs: parsedEnv.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: parsedEnv.RATE_LIMIT_MAX_REQUESTS,
  trustProxyHops: parsedEnv.TRUST_PROXY_HOPS,
};

export default env;
