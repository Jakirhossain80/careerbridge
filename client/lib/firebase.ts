"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  inMemoryPersistence,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
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

const validateFirebaseConfig = () => {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missingKeys.join(", ")}`
    );
  }
};

let firebaseApp: FirebaseApp | undefined;
let firebaseAuth: Auth | undefined;

export const getFirebaseApp = () => {
  validateFirebaseConfig();

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

export const auth =
  typeof window !== "undefined" ? getFirebaseAuth() : (undefined as unknown as Auth);

export const resendEmailVerification = async (
  user = getFirebaseAuth().currentUser
) => {
  if (!user) {
    throw new Error("No authenticated user found.");
  }

  await sendEmailVerification(user);
};

export const reloadUserAndCheckEmailVerification = async (
  user = getFirebaseAuth().currentUser
) => {
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

export const registerWithEmailVerification = async ({
  email,
  password,
  name,
}: RegisterWithVerificationInput): Promise<User> => {
  const authInstance = getFirebaseAuth();

  const userCredential = await createUserWithEmailAndPassword(
    authInstance,
    email,
    password
  );

  if (name) {
    await updateProfile(userCredential.user, {
      displayName: name,
    });
  }

  await resendEmailVerification(userCredential.user);

  return userCredential.user;
};

type LoginWithEmailInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export const loginWithEmailPassword = async ({
  email,
  password,
  rememberMe = true,
}: LoginWithEmailInput): Promise<User> => {
  const authInstance = getFirebaseAuth();

  await setPersistence(
    authInstance,
    rememberMe ? browserLocalPersistence : inMemoryPersistence
  );

  const userCredential = await signInWithEmailAndPassword(
    authInstance,
    email,
    password
  );

  return userCredential.user;
};

export const loginWithGoogle = async (): Promise<User> => {
  const authInstance = getFirebaseAuth();
  const googleProvider = new GoogleAuthProvider();

  googleProvider.setCustomParameters({
    prompt: "select_account",
  });

  await setPersistence(authInstance, browserLocalPersistence);

  const userCredential = await signInWithPopup(authInstance, googleProvider);

  // TODO: Sync this Firebase user to the CareerBridge backend when a client-side
  // user sync API is added.
  return userCredential.user;
};

export const logout = async () => {
  await signOut(getFirebaseAuth());
};

export const forgotPassword = async (email: string) => {
  await sendPasswordResetEmail(getFirebaseAuth(), email);
};

export const resetPasswordWithOobCode = async (
  oobCode: string,
  newPassword: string
) => {
  await confirmPasswordReset(getFirebaseAuth(), oobCode, newPassword);
};

export const sendVerificationEmail = resendEmailVerification;
export const reloadCurrentUserAndCheckEmailVerified =
  reloadUserAndCheckEmailVerification;
export const registerWithEmailAndVerification = registerWithEmailVerification;
export const loginWithEmailAndPassword = loginWithEmailPassword;
export const loginWithGooglePopup = loginWithGoogle;
export const sendPasswordResetLink = forgotPassword;
export const confirmPasswordResetWithCode = resetPasswordWithOobCode;
