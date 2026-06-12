const firebaseAuthErrorMessages: Record<string, string> = {
  "auth/admin-restricted-operation":
    "This sign-in method is not enabled for this project.",
  "auth/code-expired":
    "This reset link has expired. Please request a new password reset email.",
  "auth/email-already-in-use":
    "An account with this email already exists. Please log in instead.",
  "auth/expired-action-code":
    "This link has expired. Please request a new one.",
  "auth/invalid-action-code":
    "This link is invalid or has already been used.",
  "auth/invalid-credential":
    "The email or password you entered is incorrect.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-email": "Please enter your email address.",
  "auth/missing-oob-code":
    "This reset link is missing required information. Please request a new one.",
  "auth/missing-password": "Please enter your password.",
  "auth/network-request-failed":
    "We could not connect to Firebase. Please check your internet connection.",
  "auth/operation-not-allowed":
    "This sign-in method is not enabled yet.",
  "auth/account-exists-with-different-credential":
    "An account already exists with this email using a different sign-in method.",
  "auth/cancelled-popup-request":
    "Another sign-in window is already open. Please finish or close it first.",
  "auth/popup-blocked":
    "Your browser blocked the sign-in window. Please allow popups and try again.",
  "auth/popup-closed-by-user": "The sign-in window was closed before finishing.",
  "auth/requires-recent-login":
    "Please log in again before making this account change.",
  "auth/too-many-requests":
    "Too many attempts were made. Please wait a moment and try again.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account was found with this email address.",
  "auth/weak-password": "Please use a password with at least 6 characters.",
  "auth/wrong-password": "The email or password you entered is incorrect.",
};

type FirebaseLikeError = {
  code?: string;
  message?: string;
};

export const getFriendlyAuthErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as FirebaseLikeError).code === "string"
  ) {
    return (
      firebaseAuthErrorMessages[(error as FirebaseLikeError).code as string] ??
      "We could not complete that authentication request. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
};

export { firebaseAuthErrorMessages };
