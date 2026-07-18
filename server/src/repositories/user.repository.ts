import User, { type IUser } from "../models/user.model.js";

export type CreateUserInput = Pick<
  IUser,
  | "firebaseUid"
  | "name"
  | "email"
  | "photoURL"
  | "role"
  | "status"
  | "authProvider"
  | "emailVerified"
  | "lastLoginAt"
  | "isDeleted"
  | "profileCompleted"
>;

export const findUserByFirebaseUidOrEmail = async (
  firebaseUid: string,
  email: string
) => {
  return User.findOne({
    $or: [{ firebaseUid }, { email: email.toLowerCase() }],
  });
};

export const findUserByFirebaseUid = async (firebaseUid: string) =>
  User.findOne({ firebaseUid });

export const findUserByEmail = async (email: string) =>
  User.findOne({ email: email.trim().toLowerCase() });

export const createUser = async (userData: CreateUserInput) => {
  return User.create({
    ...userData,
    email: userData.email.toLowerCase(),
  });
};
