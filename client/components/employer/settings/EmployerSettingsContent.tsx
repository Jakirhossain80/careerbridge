"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { Save, Undo2 } from "lucide-react";

import AccountSettingsForm from "@/components/employer/settings/AccountSettingsForm";
import CompanySettingsForm from "@/components/employer/settings/CompanySettingsForm";
import DangerZoneCard from "@/components/employer/settings/DangerZoneCard";
import NotificationSettingsForm from "@/components/employer/settings/NotificationSettingsForm";
import PrivacySettingsForm from "@/components/employer/settings/PrivacySettingsForm";
import ProfilePhotoCard from "@/components/employer/settings/ProfilePhotoCard";
import SecuritySettingsCard from "@/components/employer/settings/SecuritySettingsCard";
import SettingsTabs, { type SettingsTab } from "@/components/employer/settings/SettingsTabs";
import TeamSettingsPanel from "@/components/employer/settings/TeamSettingsPanel";
import { FormSkeleton } from "@/components/skeletons";
import { Button, Card } from "@/components/ui";
import {
  defaultEmployerSettings,
  deactivateEmployerAccount,
  employerSettingsQueryKeys,
  getEmployerSettings,
  updateEmployerSettings,
} from "@/services/employer-settings.service";
import {
  employerSettingsSchema,
  type EmployerSettingsFormValues,
} from "@/lib/validations/employer-settings.schema";
import { appToast } from "@/lib/toast";

export default function EmployerSettingsContent() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const settingsQuery = useQuery({
    queryKey: employerSettingsQueryKeys.detail,
    queryFn: getEmployerSettings,
  });

  const methods = useForm<EmployerSettingsFormValues>({
    resolver: zodResolver(employerSettingsSchema),
    defaultValues: defaultEmployerSettings,
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
    mutationFn: updateEmployerSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(employerSettingsQueryKeys.detail, settings);
      queryClient.invalidateQueries({ queryKey: employerSettingsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: employerSettingsQueryKeys.company });
      queryClient.invalidateQueries({ queryKey: employerSettingsQueryKeys.authUser });
      reset(settings);
      setSuccessMessage("Settings updated successfully.");
      appToast.success("Settings updated successfully.");
    },
    onError: () => {
      appToast.error("Unable to save settings. Please try again.");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateEmployerAccount,
    onSuccess: () => {
      setIsDeactivateModalOpen(false);
      setSuccessMessage("Employer account deactivation request submitted.");
      appToast.success("Employer account deactivation request submitted.");
    },
    onError: () => {
      appToast.error("Unable to deactivate employer account.");
    },
  });

  function handleDiscardChanges() {
    reset(settingsQuery.data ?? defaultEmployerSettings);
    setSuccessMessage("");
  }

  function handleSaveSettings(values: EmployerSettingsFormValues) {
    setSuccessMessage("");
    updateSettingsMutation.mutate(values);
  }

  function renderActiveTab() {
    if (activeTab === "notifications") {
      return (
        <div className="space-y-6">
          <NotificationSettingsForm />
          <PrivacySettingsForm />
        </div>
      );
    }

    if (activeTab === "company") {
      return <CompanySettingsForm />;
    }

    if (activeTab === "team") {
      return <TeamSettingsPanel />;
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <AccountSettingsForm />
          <ProfilePhotoCard />
        </div>
        <SecuritySettingsCard />
        <DangerZoneCard
          isOpen={isDeactivateModalOpen}
          isDeactivating={deactivateMutation.isPending}
          onOpenChange={setIsDeactivateModalOpen}
          onDeactivate={() => deactivateMutation.mutate()}
        />
      </div>
    );
  }

  if (settingsQuery.isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6" aria-live="polite" aria-busy="true">
        <FormSkeleton sections={2} fieldsPerSection={4} />
      </div>
    );
  }

  if (settingsQuery.isError) {
    return (
      <div className="mx-auto max-w-7xl">
        <Card contentClassName="p-6 text-center">
          <h1 className="text-lg font-semibold text-red-700">
            Unable to load employer settings. Please try again.
          </h1>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => settingsQuery.refetch()}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        className="mx-auto flex max-w-7xl flex-col gap-6"
        onSubmit={handleSubmit(handleSaveSettings)}
      >
        <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Employer Workspace
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Employer Settings
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Manage your employer account, company profile, notification preferences,
              privacy controls, security options, and team access.
            </p>
          </div>

          {successMessage ? (
            <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              {successMessage}
            </div>
          ) : null}

          {updateSettingsMutation.isError ? (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
              Unable to save settings. Please try again.
            </div>
          ) : null}

          <div className="mt-5">
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </header>

        {renderActiveTab()}

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
  );
}
