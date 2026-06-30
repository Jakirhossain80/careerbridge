import { USER_ROLES, USER_STATUS } from "../constants/model.constants.js";
import {
  createUser,
  findUserByFirebaseUidOrEmail,
} from "../repositories/user.repository.js";

type SyncFirebaseUserInput = {
  firebaseUid: string;
  name: string;
  email: string;
  photoURL?: string;
};

export const syncFirebaseUser = async (userData: SyncFirebaseUserInput) => {
  const existingUser = await findUserByFirebaseUidOrEmail(
    userData.firebaseUid,
    userData.email
  );

  if (existingUser) {
    let shouldSave = false;

    if (existingUser.firebaseUid !== userData.firebaseUid) {
      existingUser.firebaseUid = userData.firebaseUid;
      shouldSave = true;
    }

    if (!existingUser.photoURL && userData.photoURL) {
      existingUser.photoURL = userData.photoURL;
      shouldSave = true;
    }

    if (shouldSave) {
      await existingUser.save();
    }

    return existingUser;
  }

  return createUser({
    firebaseUid: userData.firebaseUid,
    name: userData.name,
    email: userData.email,
    photoURL: userData.photoURL,
    role: USER_ROLES.JOB_SEEKER,
    status: USER_STATUS.ACTIVE,
    profileCompleted: false,
  });
};
