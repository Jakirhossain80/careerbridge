"use client";

import axios from "axios";

import { getFirebaseAuth } from "@/lib/firebase";

type ApiValidationError = {
  field?: string;
  message?: string;
};

function formatValidationErrors(errors: unknown) {
  if (!Array.isArray(errors)) {
    return "";
  }

  return errors
    .map((error): string => {
      if (!error || typeof error !== "object") {
        return "";
      }

      const validationError = error as ApiValidationError;
      const message =
        typeof validationError.message === "string"
          ? validationError.message
          : "";
      const field =
        typeof validationError.field === "string" && validationError.field
          ? validationError.field
          : "";

      if (!message) {
        return "";
      }

      return field ? `${field}: ${message}` : message;
    })
    .filter(Boolean)
    .join("\n");
}

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api/v1";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const user = getFirebaseAuth().currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const validationMessage =
      formatValidationErrors(error.response?.data?.errors) ||
      formatValidationErrors(error.response?.data?.error);

    if (validationMessage) {
      return validationMessage;
    }

    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}
