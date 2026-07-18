import { v2 as cloudinary } from "cloudinary";
import env from "../config/env.js";
import AppError from "./AppError.js";

let configured = false;

export const getCloudinary = () => {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new AppError(
      "File storage is not configured. Set the Cloudinary server credentials.",
      503
    );
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
};
