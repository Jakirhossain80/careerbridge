"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { RefreshCcw, Save, Undo2 } from "lucide-react";

import AccountSettingsForm from "@/components/job-seeker/settings/AccountSettingsForm";
import DangerZoneCard from "@/components/job-seeker/settings/DangerZoneCard";
import JobPreferenceSettingsForm from "@/components/job-seeker/settings/JobPreferenceSettingsForm";
import JobSeekerSettingsTabs, {
  type JobSeekerSettingsTab,
} from "@/components/job-seeker/settings/JobSeekerSettingsTabs";
import NotificationSettingsForm from "@/components/job-seeker/settings/NotificationSettingsForm";
import PrivacySettingsForm from "@/components/job-seeker/settings/PrivacySettingsForm";
import SecuritySettingsCard from "@/components/job-seeker/settings/SecuritySettingsCard";
import { FormSkeleton } from "@/components/skeletons";
import { Button, Card } from "@/components/ui";
import { mockUserSettings } from "@/data/mock-user-settings";
import { getApiErrorMessage } from "@/lib/api";
import {
  userSettingsSchema,
  type UserSettingsFormValues,
} from "@/lib/validations/user-settings.schema";
import {
  deactivateAccount,
  getUserSettings,
  updateUserSettings,
  userSettingsQueryKeys,
} from "@/services/user-settings.service";

export default function JobSeekerSettingsContent() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<JobSeekerSettingsTab>("account");
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const settingsQuery = useQuery({
    queryKey: userSettingsQueryKeys.all,
    queryFn: getUserSettings,
  });

  const methods = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: mockUserSettings,
    mode: "onBlur",
  });

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = methods;

  useEffect(() => {
    if (settingsQuery.data) {
      reset(settingsQuery.data);
    }
  }, [reset, settingsQuery.data]);

  const updateSettingsMutation = useMutation({
    mutationFn: updateUserSettings,
    onMutate: () => {
      setSuccessMessage("");
      setActionError("");
    },
    onSuccess: async (settings) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userSettingsQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: userSettingsQueryKeys.profile }),
        queryClient.invalidateQueries({ queryKey: userSettingsQueryKeys.dashboard }),
      ]);
      reset(settings);
      setSuccessMessage("Settings updated successfully.");
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error) || "Unable to update settings.");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateAccount,
    onMutate: () => {
      setSuccessMessage("");
      setActionError("");
    },
    onSuccess: () => {
      setIsDeactivateModalOpen(false);
      setSuccessMessage("Account deactivation request submitted.");
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error) || "Unable to deactivate account.");
    },
  });

  function handleDiscardChanges() {
    reset(settingsQuery.data ?? mockUserSettings);
    setSuccessMessage("");
    setActionError("");
  }

  function handleSaveSettings(values: UserSettingsFormValues) {
    updateSettingsMutation.mutate(values);
  }

  function renderActiveTab() {
    if (activeTab === "notifications") {
      return <NotificationSettingsForm />;
    }

    if (activeTab === "privacy") {
      return <PrivacySettingsForm />;
    }

    if (activeTab === "job-preferences") {
      return <JobPreferenceSettingsForm />;
    }

    return (
      <div className="space-y-6">
        <AccountSettingsForm />
        <SecuritySettingsCard />
      </div>
    );
  }

  if (settingsQuery.isLoading) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8" aria-live="polite" aria-busy="true">
        <div className="mx-auto max-w-7xl">
          <FormSkeleton sections={2} fieldsPerSection={4} />
        </div>
      </main>
    );
  }

  if (settingsQuery.isError) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card contentClassName="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-red-700">
                  Unable to load settings. Please try again.
                </h1>
                <p className="mt-1 text-sm text-muted">
                  Account preferences, notifications, and privacy controls could not be
                  loaded.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => settingsQuery.refetch()}
                leftIcon={<RefreshCcw className="size-4" aria-hidden="true" />}
              >
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <FormProvider {...methods}>
        <form
          className="mx-auto flex max-w-7xl flex-col gap-6"
          onSubmit={handleSubmit(handleSaveSettings)}
        >
          <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Settings
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
                Manage your account preferences, notifications, and privacy controls.
              </p>
            </div>

            {successMessage ? (
              <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                {successMessage}
              </div>
            ) : null}

            {actionError ? (
              <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                {actionError}
              </div>
            ) : null}

            {!settingsQuery.data ? (
              <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                No saved settings were found. Sensible defaults are ready to save.
              </div>
            ) : null}

            <div className="mt-5">
              <JobSeekerSettingsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </header>

          {renderActiveTab()}

          <DangerZoneCard
            isOpen={isDeactivateModalOpen}
            isDeactivating={deactivateMutation.isPending}
            onOpenChange={setIsDeactivateModalOpen}
            onDeactivate={() => deactivateMutation.mutate()}
          />

          <footer className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-background/95 px-4 py-4 backdrop-blur dark:border-slate-700 sm:mx-0 sm:rounded-lg sm:border sm:bg-surface sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                {isDirty ? "You have unsaved changes." : "All visible settings are up to date."}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  leftIcon={<Undo2 className="size-4" aria-hidden="true" />}
                  onClick={handleDiscardChanges}
                  disabled={!isDirty || updateSettingsMutation.isPending}
                >
                  Discard Changes
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  leftIcon={<Save className="size-4" aria-hidden="true" />}
                  isLoading={updateSettingsMutation.isPending}
                >
                  Save All Settings
                </Button>
              </div>
            </div>
          </footer>
        </form>
      </FormProvider>
    </main>
  );
}
