import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./firebase";

export const registerUser = (
  email: string,
  password: string
) => {
  return createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
};

export const loginUser = (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};

export const logoutUser = () => {
  return signOut(auth);
};

export const resetPassword = (
  email: string
) => {
  return sendPasswordResetEmail(
    auth,
    email
  );
};

