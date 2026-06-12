"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  confirmPasswordReset,
  getAuth,
  inMemoryPersistence,
  reload,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
  type Auth,
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

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;

const getFirebaseApp = () => {
  if (!firebaseApp) {
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser.");
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp());
  }

  return firebaseAuth;
};

export const sendVerificationEmail = async (
  user = getFirebaseAuth().currentUser
) => {
  if (!user) {
    throw new Error("No authenticated user found.");
  }

  await sendEmailVerification(user);
};

export const reloadCurrentUserAndCheckEmailVerified = async () => {
  const user = getFirebaseAuth().currentUser;

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
  const auth = getFirebaseAuth();
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

type LoginWithEmailInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export const loginWithEmailAndPassword = async ({
  email,
  password,
  rememberMe = true,
}: LoginWithEmailInput): Promise<User> => {
  const auth = getFirebaseAuth();
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : inMemoryPersistence
  );

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

export const sendPasswordResetLink = async (email: string) => {
  const auth = getFirebaseAuth();

  await sendPasswordResetEmail(auth, email);
};

export const confirmPasswordResetWithCode = async (
  oobCode: string,
  newPassword: string
) => {
  const auth = getFirebaseAuth();

  await confirmPasswordReset(auth, oobCode, newPassword);
};
