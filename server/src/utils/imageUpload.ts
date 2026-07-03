import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import env from "../config/env.js";
import AppError from "./AppError.js";

type ImageUploadOptions = {
  folder: string;
  publicId: string;
  transformation?: Array<Record<string, string | number>>;
};

let cloudinaryConfigured = false;

const configureCloudinary = () => {
  if (cloudinaryConfigured) {
    return true;
  }

  if (
    !env.cloudinaryCloudName ||
    !env.cloudinaryApiKey ||
    !env.cloudinaryApiSecret
  ) {
    return false;
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });
  cloudinaryConfigured = true;
  return true;
};

export const uploadImageBuffer = async (
  buffer: Buffer,
  options: ImageUploadOptions
) => {
  if (!configureCloudinary()) {
    throw new AppError(
      "Image upload storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the server.",
      500
    );
  }

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        overwrite: true,
        resource_type: "image",
        transformation: options.transformation,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new AppError("Image upload failed", 500));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};
