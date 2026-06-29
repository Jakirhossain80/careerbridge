"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { KeyRound, Save, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import PasswordInput from "@/components/shared/PasswordInput";
import SettingsCard from "@/components/settings/SettingsCard";
import { Button } from "@/components/ui";
import { getFriendlyAuthErrorMessage } from "@/lib/auth-errors";
import { changePassword } from "@/lib/firebase";
import { appToast } from "@/lib/toast";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/lib/validations/password.schema";

type ChangePasswordFormProps = {
  cancelHref?: string;
};

type PasswordStrength = {
  label: "Weak" | "Medium" | "Strong";
  score: number;
  className: string;
};

const defaultValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getPasswordStrength(password: string): PasswordStrength {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (score >= 5) {
    return {
      label: "Strong",
      score,
      className: "bg-emerald-500",
    };
  }

  if (score >= 3) {
    return {
      label: "Medium",
      score,
      className: "bg-amber-500",
    };
  }

  return {
    label: "Weak",
    score,
    className: "bg-red-500",
  };
}

function getChangePasswordErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: string }).code;

    if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
      return "Current password is incorrect.";
    }

    if (code === "auth/requires-recent-login") {
      return "Please sign in again and try changing your password.";
    }

    if (code === "auth/weak-password") {
      return "Your new password is too weak.";
    }

    if (code === "auth/too-many-requests") {
      return "Too many attempts were made. Please wait a moment and try again.";
    }

    if (code === "auth/network-request-failed") {
      return "We could not connect to Firebase. Please check your internet connection.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return getFriendlyAuthErrorMessage(error) || "Unable to update password. Please try again.";
}

export default function ChangePasswordForm({
  cancelHref = "/job-seeker/settings",
}: ChangePasswordFormProps) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
    mode: "onBlur",
  });

  const newPassword = useWatch({
    control,
    name: "newPassword",
  }) ?? "";
  const strength = useMemo(
    () => getPasswordStrength(newPassword || ""),
    [newPassword],
  );
  const strengthWidth = `${Math.max(strength.score, newPassword ? 1 : 0) * 20}%`;

  async function handleChangePassword(values: ChangePasswordFormValues) {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset(defaultValues);
      setSuccessMessage("Password updated successfully.");
      appToast.success("Password updated successfully.");
    } catch (error) {
      const message = getChangePasswordErrorMessage(error);
      setErrorMessage(message);
      appToast.error(message);
    }
  }

  return (
    <SettingsCard
      title="Update Security Credentials"
      description="Change your sign-in password after confirming your current password."
      icon={<KeyRound className="size-5" aria-hidden="true" />}
    >
      <form className="space-y-5" onSubmit={handleSubmit(handleChangePassword)}>
        {successMessage ? (
          <div
            className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
            role="status"
          >
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        <PasswordInput
          label="Current Password"
          autoComplete="current-password"
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          disabled={isSubmitting}
          required
          {...register("currentPassword")}
        />

        <div className="space-y-3">
          <PasswordInput
            label="New Password"
            autoComplete="new-password"
            placeholder="Enter your new password"
            error={errors.newPassword?.message}
            disabled={isSubmitting}
            required
            {...register("newPassword")}
          />

          <div aria-live="polite">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase text-muted">
                Password strength
              </span>
              <span className="text-xs font-semibold text-foreground">
                {newPassword ? strength.label : "Weak"}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full rounded-full transition-all ${strength.className}`}
                style={{ width: strengthWidth }}
              />
            </div>
          </div>
        </div>

        <PasswordInput
          label="Confirm New Password"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
          required
          {...register("confirmPassword")}
        />

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            leftIcon={<X className="size-4" aria-hidden="true" />}
            disabled={isSubmitting}
            onClick={() => router.push(cancelHref)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            leftIcon={<Save className="size-4" aria-hidden="true" />}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Updating password..." : "Update Password"}
          </Button>
        </div>
      </form>
    </SettingsCard>
  );
}

export type { ChangePasswordFormProps };
