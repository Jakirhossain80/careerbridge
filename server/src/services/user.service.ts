import {
  AUTH_PROVIDERS,
  USER_ROLES,
  USER_STATUS,
  type AuthProvider,
  type UserRole,
} from "../constants/model.constants.js";
import {
  createUser,
  findUserByEmail,
  findUserByFirebaseUid,
  findUserByFirebaseUidOrEmail,
} from "../repositories/user.repository.js";
import AppError from "../utils/AppError.js";

type SyncFirebaseUserInput = {
  firebaseUid: string;
  name: string;
  email: string;
  photoURL?: string;
  authProvider: AuthProvider;
  emailVerified: boolean;
  requestedRole?: UserRole;
};

export type SyncUserDependencies = {
  findByUidOrEmail: typeof findUserByFirebaseUidOrEmail;
  findByUid: typeof findUserByFirebaseUid;
  findByEmail: typeof findUserByEmail;
  create: typeof createUser;
};

const defaultSyncUserDependencies: SyncUserDependencies = {
  findByUidOrEmail: findUserByFirebaseUidOrEmail,
  findByUid: findUserByFirebaseUid,
  findByEmail: findUserByEmail,
  create: createUser,
};

export const syncFirebaseUser = async (
  userData: SyncFirebaseUserInput,
  dependencies: SyncUserDependencies = defaultSyncUserDependencies
): Promise<Awaited<ReturnType<typeof createUser>>> => {
  const normalizedEmail = userData.email.trim().toLowerCase();
  const existingUser = await dependencies.findByUidOrEmail(
    userData.firebaseUid,
    normalizedEmail
  );

  if (existingUser) {
    if (existingUser.isDeleted) {
      throw new AppError("Forbidden: account has been deleted", 403);
    }

    let shouldSave = false;

    if (existingUser.firebaseUid !== userData.firebaseUid) {
      throw new AppError(
        "An account with this email already uses a different sign-in identity. Sign in with the original method before linking another provider.",
        409
      );
    }

    if (!existingUser.photoURL && userData.photoURL) {
      existingUser.photoURL = userData.photoURL;
      shouldSave = true;
    }

    if (!existingUser.authProvider) {
      existingUser.authProvider = userData.authProvider ?? AUTH_PROVIDERS.PASSWORD;
      shouldSave = true;
    } else if (existingUser.authProvider !== userData.authProvider) {
      existingUser.authProvider = userData.authProvider;
      shouldSave = true;
    }

    if (existingUser.emailVerified !== userData.emailVerified) {
      existingUser.emailVerified = userData.emailVerified;
      shouldSave = true;
    }

    if (existingUser.isDeleted === undefined) {
      existingUser.isDeleted = false;
      shouldSave = true;
    }

    existingUser.lastLoginAt = new Date();
    shouldSave = true;

    if (shouldSave) {
      await existingUser.save();
    }

    return existingUser;
  }

  const role = userData.requestedRole ?? USER_ROLES.JOB_SEEKER;
  const status =
    role === USER_ROLES.EMPLOYER ? USER_STATUS.PENDING : USER_STATUS.ACTIVE;

  try {
    return await dependencies.create({
      firebaseUid: userData.firebaseUid,
      name: userData.name,
      email: normalizedEmail,
      photoURL: userData.photoURL,
      role,
      status,
      authProvider: userData.authProvider,
      emailVerified: userData.emailVerified,
      lastLoginAt: new Date(),
      isDeleted: false,
      profileCompleted: false,
    });
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === 11000)) {
      throw error;
    }

    const concurrentUser =
      (await dependencies.findByUid(userData.firebaseUid)) ??
      (await dependencies.findByEmail(normalizedEmail));

    if (!concurrentUser) {
      throw error;
    }

    if (concurrentUser.firebaseUid !== userData.firebaseUid) {
      throw new AppError(
        "An account with this email already uses a different sign-in identity. Sign in with the original method before linking another provider.",
        409
      );
    }

    return syncFirebaseUser(userData, dependencies);
  }
};
