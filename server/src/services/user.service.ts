import {
  AUTH_PROVIDERS,
  USER_ROLES,
  USER_STATUS,
  type AuthProvider,
  type UserRole,
} from "../constants/model.constants.js";
import {
  createUser,
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

export const syncFirebaseUser = async (userData: SyncFirebaseUserInput) => {
  const existingUser = await findUserByFirebaseUidOrEmail(
    userData.firebaseUid,
    userData.email
  );

  if (existingUser) {
    if (existingUser.isDeleted) {
      throw new AppError("Forbidden: account has been deleted", 403);
    }

    let shouldSave = false;

    if (existingUser.firebaseUid !== userData.firebaseUid) {
      existingUser.firebaseUid = userData.firebaseUid;
      shouldSave = true;
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

  return createUser({
    firebaseUid: userData.firebaseUid,
    name: userData.name,
    email: userData.email,
    photoURL: userData.photoURL,
    role,
    status,
    authProvider: userData.authProvider,
    emailVerified: userData.emailVerified,
    lastLoginAt: new Date(),
    isDeleted: false,
    profileCompleted: false,
  });
};
