"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  reload,
  sendEmailVerification,
  updateProfile,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const sendVerificationEmail = async (user = auth.currentUser) => {
  if (!user) {
    throw new Error("No authenticated user found.");
  }

  await sendEmailVerification(user);
};

export const reloadCurrentUserAndCheckEmailVerified = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  await reload(user);
  return user.emailVerified;
};

type RegisterWithVerificationInput = {
  email: string;
  password: string;
  name?: string;
};

export const registerWithEmailAndVerification = async ({
  email,
  password,
  name,
}: RegisterWithVerificationInput): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (name) {
    await updateProfile(userCredential.user, {
      displayName: name,
    });
  }

  await sendVerificationEmail(userCredential.user);

  return userCredential.user;
};
