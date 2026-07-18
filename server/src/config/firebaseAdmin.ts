import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import env from "./env.js";

let adminAuth: Auth | undefined;

export const getAdminAuth = () => {
  if (!adminAuth) {
    const firebaseAdminApp =
      getApps().length > 0
        ? getApp()
        : initializeApp({
            credential: cert({
              projectId: env.firebaseProjectId,
              clientEmail: env.firebaseClientEmail,
              privateKey: env.firebasePrivateKey,
            }),
          });

    adminAuth = getAuth(firebaseAdminApp);
  }

  return adminAuth;
};
