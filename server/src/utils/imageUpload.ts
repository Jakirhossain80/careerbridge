import type { UploadApiResponse } from "cloudinary";
import AppError from "./AppError.js";
import { getCloudinary } from "./cloudinary.js";

type ImageUploadOptions = {
  folder: string;
  publicId: string;
  transformation?: Array<Record<string, string | number>>;
};

export const uploadImageBuffer = async (
  buffer: Buffer,
  options: ImageUploadOptions
) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = getCloudinary().uploader.upload_stream(
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
