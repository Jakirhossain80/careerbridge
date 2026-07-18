import path from "node:path";
import { randomUUID } from "node:crypto";
import type { UploadApiResponse } from "cloudinary";
import env from "../config/env.js";
import AppError from "./AppError.js";
import { getCloudinary } from "./cloudinary.js";

export type StoredResumeAsset = {
  provider: "cloudinary";
  assetId: string;
  publicId: string;
  secureUrl: string;
  resourceType: "raw";
  deliveryType: "private";
  format: string;
  bytes: number;
};

export interface ResumeStorageProvider {
  upload(input: {
    buffer: Buffer;
    displayFileName: string;
    ownerId: string;
  }): Promise<StoredResumeAsset>;
  delete(asset: Pick<StoredResumeAsset, "publicId" | "resourceType" | "deliveryType">): Promise<void>;
  createDownloadUrl(
    asset: Pick<StoredResumeAsset, "publicId" | "resourceType" | "deliveryType" | "format">,
    options?: { expiresInSeconds?: number }
  ): { url: string; expiresAt: Date };
}

export const sanitizeResumeFileName = (fileName: string) => {
  const extension = path.extname(path.basename(fileName)).toLowerCase();
  const baseName = path.basename(fileName, extension)
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}._ ()-]+/gu, "-")
    .replace(/\s+/g, " ")
    .replace(/^[ ._-]+|[ ._-]+$/g, "")
    .slice(0, 100);

  return `${baseName || "resume"}${extension}`;
};

const uploadBuffer = (
  buffer: Buffer,
  options: { publicId: string; displayName: string }
) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = getCloudinary().uploader.upload_stream(
      {
        resource_type: "raw",
        type: "private",
        public_id: options.publicId,
        display_name: options.displayName,
        overwrite: false,
      },
      (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new AppError("Resume storage upload failed", 502));
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

export const cloudinaryResumeStorage: ResumeStorageProvider = {
  async upload({ buffer, displayFileName, ownerId }) {
    const safeName = sanitizeResumeFileName(displayFileName);
    const extension = path.extname(safeName).toLowerCase();
    const format = extension.slice(1);
    const publicId = `${env.cloudinaryUploadFolder}/resumes/${ownerId}/${randomUUID()}${extension}`;
    const result = await uploadBuffer(buffer, { publicId, displayName: safeName });

    return {
      provider: "cloudinary",
      assetId: result.asset_id,
      publicId: result.public_id,
      secureUrl: result.secure_url,
      resourceType: "raw",
      deliveryType: "private",
      format,
      bytes: result.bytes,
    };
  },

  async delete(asset) {
    const result = await getCloudinary().uploader.destroy(asset.publicId, {
      resource_type: asset.resourceType,
      type: asset.deliveryType,
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new AppError("Resume storage deletion failed", 502);
    }
  },

  createDownloadUrl(asset, options = {}) {
    const expiresAt = new Date(
      Date.now() + (options.expiresInSeconds ?? 300) * 1000
    );
    const url = getCloudinary().utils.private_download_url(
      asset.publicId,
      asset.format,
      {
        resource_type: asset.resourceType,
        type: asset.deliveryType,
        expires_at: Math.floor(expiresAt.getTime() / 1000),
        attachment: true,
      }
    );
    return { url, expiresAt };
  },
};

export const deleteResumeAssetWithRetry = async (
  storage: ResumeStorageProvider,
  asset: StoredResumeAsset,
  attempts = 3
) => {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await storage.delete(asset);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};
