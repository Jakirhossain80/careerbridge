import path from "node:path";
import multer from "multer";
import type { RequestHandler } from "express";
import env from "../config/env.js";
import AppError from "../utils/AppError.js";

export type UploadPolicy = {
  fieldName: string;
  maxBytes: number;
  allowedTypes: ReadonlyMap<string, ReadonlySet<string>>;
};

const imageTypes = new Map([
  ["image/jpeg", new Set([".jpg", ".jpeg"])],
  ["image/png", new Set([".png"])],
  ["image/webp", new Set([".webp"])],
]);

const resumeTypes = new Map([
  ["application/pdf", new Set([".pdf"])],
  ["application/msword", new Set([".doc"])],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    new Set([".docx"]),
  ],
]);

const createUpload = ({ fieldName, maxBytes, allowedTypes }: UploadPolicy) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes, files: 1, fields: 10 },
    fileFilter: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = allowedTypes.get(file.mimetype.toLowerCase());

      if (!allowedExtensions?.has(extension)) {
        callback(
          new AppError(
            `Unsupported ${fieldName} file type or extension`,
            415
          )
        );
        return;
      }

      callback(null, true);
    },
  }).single(fieldName);

export const uploadAvatarFile = createUpload({
  fieldName: "avatar",
  maxBytes: env.avatarUploadMaxBytes,
  allowedTypes: imageTypes,
});

export const uploadCompanyLogoFile = createUpload({
  fieldName: "logo",
  maxBytes: env.companyLogoUploadMaxBytes,
  allowedTypes: imageTypes,
});

export const uploadCompanyBannerFile = createUpload({
  fieldName: "banner",
  maxBytes: env.companyBannerUploadMaxBytes,
  allowedTypes: imageTypes,
});

export const uploadResumeFile = createUpload({
  fieldName: "resume",
  maxBytes: env.resumeUploadMaxBytes,
  allowedTypes: resumeTypes,
});

const hasPrefix = (buffer: Buffer, prefix: readonly number[]) =>
  prefix.every((byte, index) => buffer[index] === byte);

export const validateResumeFileContents: RequestHandler = (req, _res, next) => {
  const file = req.file;
  if (!file) {
    next();
    return;
  }

  const valid =
    (file.mimetype === "application/pdf" &&
      hasPrefix(file.buffer, [0x25, 0x50, 0x44, 0x46, 0x2d])) ||
    (file.mimetype === "application/msword" &&
      hasPrefix(file.buffer, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) ||
    (file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      hasPrefix(file.buffer, [0x50, 0x4b, 0x03, 0x04]));

  if (!valid) {
    next(new AppError("Resume file contents do not match its declared type", 415));
    return;
  }

  next();
};

export const createUploadMiddleware = createUpload;
export const uploadAllowedTypes = { imageTypes, resumeTypes } as const;
