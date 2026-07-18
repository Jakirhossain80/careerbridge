import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";
import Resume from "../models/resume.model.js";
import {
  createResume,
  deleteResume,
  getResumeDownload,
  setDefaultResume,
} from "../services/jobSeeker.service.js";
import type {
  ResumeStorageProvider,
  StoredResumeAsset,
} from "../utils/resumeStorage.js";

const owner = {
  userId: "507f1f77bcf86cd799439010",
  jobSeekerId: "507f1f77bcf86cd799439011",
  email: "test@example.com",
  firebaseUid: "test-uid",
  name: "Test User",
};

const asset: StoredResumeAsset = {
  provider: "cloudinary",
  assetId: "asset-test",
  publicId: "careerbridge/resumes/owner/test.pdf",
  secureUrl: "https://example.invalid/private/test.pdf",
  resourceType: "raw",
  deliveryType: "private",
  format: "pdf",
  bytes: 12,
};

const file = {
  originalname: "../Unsafe  Resume?.pdf",
  mimetype: "application/pdf",
  size: 12,
  buffer: Buffer.from("%PDF-1.7 test"),
} as Express.Multer.File;

const createStorage = () => {
  const calls = { uploads: 0, deletes: 0, downloads: 0 };
  const storage: ResumeStorageProvider = {
    async upload() {
      calls.uploads += 1;
      return asset;
    },
    async delete() {
      calls.deletes += 1;
    },
    createDownloadUrl() {
      calls.downloads += 1;
      return { url: "https://example.invalid/signed", expiresAt: new Date(1_900_000_000_000) };
    },
  };
  return { storage, calls };
};

const patchMethod = <T extends object, K extends keyof T>(target: T, key: K, value: T[K]) => {
  const original = target[key];
  target[key] = value;
  return () => {
    target[key] = original;
  };
};

const fakeSession = {
  async withTransaction(callback: () => Promise<void>) {
    await callback();
  },
  async endSession() {},
};

test("first resume becomes default and database failure cleans up storage", async () => {
  const { storage, calls } = createStorage();
  const restores = [
    patchMethod(mongoose, "startSession", async () => fakeSession as never),
    patchMethod(Resume, "countDocuments", (() => ({ session: async () => 0 })) as never),
    patchMethod(Resume, "updateMany", (async () => ({ acknowledged: true })) as never),
    patchMethod(Resume, "create", (async () => { throw new Error("database unavailable"); }) as never),
  ];

  try {
    await assert.rejects(() => createResume(owner, file, { isDefault: false }, storage));
    assert.equal(calls.uploads, 1);
    assert.equal(calls.deletes, 1);
  } finally {
    restores.reverse().forEach((restore) => restore());
  }
});

test("storage failure prevents database metadata creation", async () => {
  const { storage } = createStorage();
  storage.upload = async () => { throw new Error("storage unavailable"); };
  let databaseCreateCalled = false;
  const restore = patchMethod(Resume, "create", (async () => {
    databaseCreateCalled = true;
    return [];
  }) as never);
  try {
    await assert.rejects(() => createResume(owner, file, { isDefault: false }, storage));
    assert.equal(databaseCreateCalled, false);
  } finally {
    restore();
  }
});

test("successful first upload persists provider metadata and defaults atomically", async () => {
  const { storage, calls } = createStorage();
  let persisted: Record<string, unknown> | undefined;
  const document = { _id: "resume-id", isDefault: true };
  const restores = [
    patchMethod(mongoose, "startSession", async () => fakeSession as never),
    patchMethod(Resume, "countDocuments", (() => ({ session: async () => 0 })) as never),
    patchMethod(Resume, "updateMany", (async () => ({ acknowledged: true })) as never),
    patchMethod(Resume, "create", (async (items: Record<string, unknown>[]) => {
      persisted = items[0];
      return [document];
    }) as never),
  ];

  try {
    const result = await createResume(owner, file, { isDefault: false }, storage);
    assert.equal(result, document);
    assert.equal(persisted?.isDefault, true);
    assert.equal(persisted?.providerPublicId, asset.publicId);
    assert.equal(persisted?.fileName, "Unsafe Resume.pdf");
    assert.equal(calls.deletes, 0);
  } finally {
    restores.reverse().forEach((restore) => restore());
  }
});

test("default selection and downloads are scoped to the authenticated owner", async () => {
  const { storage, calls } = createStorage();
  let ownershipFilter: Record<string, unknown> | undefined;
  const resume = { ...asset, ...{
    _id: "resume-id",
    jobSeekerId: owner.jobSeekerId,
    providerAssetId: asset.assetId,
    providerPublicId: asset.publicId,
    providerResourceType: asset.resourceType,
    providerDeliveryType: asset.deliveryType,
    providerFormat: asset.format,
    fileUrl: asset.secureUrl,
    fileSize: asset.bytes,
  }};
  const restores = [
    patchMethod(mongoose, "startSession", async () => fakeSession as never),
    patchMethod(Resume, "findOne", ((filter: Record<string, unknown>) => {
      ownershipFilter = filter;
      return { session: async () => resume, lean: async () => resume };
    }) as never),
    patchMethod(Resume, "updateMany", (async () => ({ acknowledged: true })) as never),
    patchMethod(Resume, "updateOne", (async () => ({ acknowledged: true })) as never),
  ];

  try {
    await setDefaultResume(owner, "resume-id");
    assert.equal(ownershipFilter?.jobSeekerId, owner.jobSeekerId);
    const download = await getResumeDownload(owner, "resume-id", storage);
    assert.equal(download.downloadUrl, "https://example.invalid/signed");
    assert.equal(calls.downloads, 1);
  } finally {
    restores.reverse().forEach((restore) => restore());
  }
});

test("cross-user access is hidden and deletion stops when provider cleanup fails", async () => {
  const { storage } = createStorage();
  storage.delete = async () => { throw new Error("storage unavailable"); };
  let databaseDeleteCalled = false;
  const resume = {
    isDefault: false,
    providerAssetId: asset.assetId,
    providerPublicId: asset.publicId,
    providerResourceType: asset.resourceType,
    providerDeliveryType: asset.deliveryType,
    providerFormat: asset.format,
    fileUrl: asset.secureUrl,
    fileSize: asset.bytes,
  };
  const restores = [
    patchMethod(mongoose, "startSession", async () => fakeSession as never),
    patchMethod(Resume, "findOne", (() => ({ session: async () => resume, lean: async () => null })) as never),
    patchMethod(Resume, "deleteOne", (async () => {
      databaseDeleteCalled = true;
      return { acknowledged: true };
    }) as never),
  ];

  try {
    await assert.rejects(() => getResumeDownload(owner, "other-user-resume", storage));
    await assert.rejects(() => deleteResume(owner, "resume-id", storage));
    assert.equal(databaseDeleteCalled, false);
  } finally {
    restores.reverse().forEach((restore) => restore());
  }
});

test("deleting an owned default resume cleans storage and promotes the next resume", async () => {
  const { storage, calls } = createStorage();
  let findCall = 0;
  let databaseDeleteCalled = false;
  let promoted = false;
  const ownedResume = {
    _id: "resume-id",
    isDefault: true,
    providerAssetId: asset.assetId,
    providerPublicId: asset.publicId,
    providerResourceType: asset.resourceType,
    providerDeliveryType: asset.deliveryType,
    providerFormat: asset.format,
    fileUrl: asset.secureUrl,
    fileSize: asset.bytes,
  };
  const restores = [
    patchMethod(mongoose, "startSession", async () => fakeSession as never),
    patchMethod(Resume, "findOne", (() => {
      findCall += 1;
      if (findCall === 1) return { session: async () => ownedResume };
      return {
        sort() {
          return { session: async () => ({ _id: "next-resume" }) };
        },
      };
    }) as never),
    patchMethod(Resume, "deleteOne", (async () => {
      databaseDeleteCalled = true;
      return { acknowledged: true };
    }) as never),
    patchMethod(Resume, "updateOne", (async () => {
      promoted = true;
      return { acknowledged: true };
    }) as never),
  ];

  try {
    await deleteResume(owner, "resume-id", storage);
    assert.equal(calls.deletes, 1);
    assert.equal(databaseDeleteCalled, true);
    assert.equal(promoted, true);
  } finally {
    restores.reverse().forEach((restore) => restore());
  }
});
