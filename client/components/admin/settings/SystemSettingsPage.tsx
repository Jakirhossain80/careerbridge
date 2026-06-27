"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  LockKeyhole,
  Mail,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Undo2,
  Users,
} from "lucide-react";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import SettingsCard from "@/components/settings/SettingsCard";
import ToggleSwitch from "@/components/settings/ToggleSwitch";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import Input from "@/components/ui/Input";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import Textarea from "@/components/ui/Textarea";
import { useAdminSettings, useAdminSettingsMutations } from "@/hooks/admin/useAdminSettings";
import { getApiErrorMessage } from "@/lib/api";
import {
  adminSettingsSchema,
  type AdminSettingsFormValues,
} from "@/lib/validations/admin-settings.schema";
import type { AdminSystemSettings } from "@/types/admin-settings";

const defaultSettings: AdminSettingsFormValues = {
  general: {
    platformName: "CareerBridge",
    platformTagline: "Connecting talent with opportunity",
    platformDescription: "CareerBridge is a full-stack job portal for job seekers, employers, recruiters, and administrators.",
    contactEmail: "contact@careerbridge.local",
    supportEmail: "support@careerbridge.local",
    contactPhone: "",
    companyAddress: "",
  },
  platform: {
    maintenanceMode: false,
    publicRegistrationEnabled: true,
    employerRegistrationEnabled: true,
    jobPostingEnabled: true,
    blogModuleEnabled: true,
  },
  authentication: {
    emailLoginEnabled: true,
    googleLoginEnabled: true,
    passwordResetEnabled: true,
    emailVerificationRequired: true,
  },
  registration: {
    autoApproveJobSeekers: true,
    requireProfileCompletion: false,
    resumeUploadRequirement: false,
  },
  employerApproval: {
    employerVerificationRequired: true,
    manualEmployerApproval: true,
    companyVerificationRequired: true,
  },
  jobApproval: {
    manualJobApproval: true,
    autoPublishJobs: false,
    featuredJobRequirements: true,
  },
  blog: {
    blogPublishingEnabled: true,
    commentingEnabled: false,
    featuredBlogsEnabled: true,
  },
  notifications: {
    emailNotifications: true,
    applicationNotifications: true,
    interviewNotifications: true,
    adminNotifications: true,
  },
  email: {
    senderName: "CareerBridge",
    senderEmail: "noreply@careerbridge.local",
    replyToEmail: "support@careerbridge.local",
  },
  security: {
    sessionTimeoutMinutes: 120,
    loginAttemptLimit: 5,
    minimumPasswordLength: 8,
    requirePasswordUppercase: true,
    requirePasswordNumber: true,
    requirePasswordSymbol: false,
    twoFactorRequired: false,
  },
  seo: {
    defaultSeoTitle: "CareerBridge - Find Jobs and Hire Talent",
    defaultSeoDescription: "Discover jobs, manage applications, and connect with employers on CareerBridge.",
    openGraphTitle: "CareerBridge",
    openGraphDescription: "A modern job portal for candidates and employers.",
    openGraphImage: "",
  },
  analytics: {
    analyticsEnabled: true,
    trackingEnabled: true,
    anonymizeIp: true,
    reportingEnabled: true,
  },
};

type ToggleName =
  | "platform.maintenanceMode"
  | "platform.publicRegistrationEnabled"
  | "platform.employerRegistrationEnabled"
  | "platform.jobPostingEnabled"
  | "platform.blogModuleEnabled"
  | "authentication.emailLoginEnabled"
  | "authentication.googleLoginEnabled"
  | "authentication.passwordResetEnabled"
  | "authentication.emailVerificationRequired"
  | "registration.autoApproveJobSeekers"
  | "registration.requireProfileCompletion"
  | "registration.resumeUploadRequirement"
  | "employerApproval.employerVerificationRequired"
  | "employerApproval.manualEmployerApproval"
  | "employerApproval.companyVerificationRequired"
  | "jobApproval.manualJobApproval"
  | "jobApproval.autoPublishJobs"
  | "jobApproval.featuredJobRequirements"
  | "blog.blogPublishingEnabled"
  | "blog.commentingEnabled"
  | "blog.featuredBlogsEnabled"
  | "notifications.emailNotifications"
  | "notifications.applicationNotifications"
  | "notifications.interviewNotifications"
  | "notifications.adminNotifications"
  | "security.requirePasswordUppercase"
  | "security.requirePasswordNumber"
  | "security.requirePasswordSymbol"
  | "security.twoFactorRequired"
  | "analytics.analyticsEnabled"
  | "analytics.trackingEnabled"
  | "analytics.anonymizeIp"
  | "analytics.reportingEnabled";

function ToggleField({
  name,
  label,
  description,
}: {
  name: ToggleName;
  label: string;
  description?: string;
}) {
  const { control } = useFormContext<AdminSettingsFormValues>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <ToggleSwitch
          label={label}
          description={description}
          checked={Boolean(field.value)}
          onChange={(event) => field.onChange(event.target.checked)}
        />
      )}
    />
  );
}

function formatDate(value?: string) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function GeneralSettingsSection() {
  const { register, formState: { errors } } = useFormContext<AdminSettingsFormValues>();

  return (
    <SettingsCard title="General Settings" description="Control platform identity and public contact information." icon={<Globe className="size-5" aria-hidden="true" />}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Platform Name" error={errors.general?.platformName?.message} {...register("general.platformName")} />
        <Input label="Platform Tagline" error={errors.general?.platformTagline?.message} {...register("general.platformTagline")} />
        <Input label="Contact Email" error={errors.general?.contactEmail?.message} {...register("general.contactEmail")} />
        <Input label="Support Email" error={errors.general?.supportEmail?.message} {...register("general.supportEmail")} />
        <Input label="Contact Phone" error={errors.general?.contactPhone?.message} {...register("general.contactPhone")} />
        <Input label="Company Address" error={errors.general?.companyAddress?.message} {...register("general.companyAddress")} />
        <Textarea wrapperClassName="md:col-span-2" label="Platform Description" rows={4} error={errors.general?.platformDescription?.message} {...register("general.platformDescription")} />
      </div>
    </SettingsCard>
  );
}

function ToggleSettingsSection({
  title,
  description,
  icon,
  fields,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  fields: Array<{ name: ToggleName; label: string; description?: string }>;
}) {
  return (
    <SettingsCard title={title} description={description} icon={icon} contentClassName="divide-y divide-slate-200 p-0 dark:divide-slate-700">
      {fields.map((field) => (
        <ToggleField key={field.name} {...field} />
      ))}
    </SettingsCard>
  );
}

function EmailSettingsSection() {
  const { register, formState: { errors } } = useFormContext<AdminSettingsFormValues>();

  return (
    <SettingsCard title="Email Settings" description="Public sender identity only. Credentials are never exposed here." icon={<Mail className="size-5" aria-hidden="true" />}>
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="Sender Name" error={errors.email?.senderName?.message} {...register("email.senderName")} />
        <Input label="Sender Email" error={errors.email?.senderEmail?.message} {...register("email.senderEmail")} />
        <Input label="Reply-To Email" error={errors.email?.replyToEmail?.message} {...register("email.replyToEmail")} />
      </div>
    </SettingsCard>
  );
}

function SecuritySettingsSection() {
  const { register, formState: { errors } } = useFormContext<AdminSettingsFormValues>();

  return (
    <SettingsCard title="Security Settings" description="Session, login attempt, password policy, and two-factor controls." icon={<LockKeyhole className="size-5" aria-hidden="true" />}>
      <div className="grid gap-4 md:grid-cols-3">
        <Input type="number" label="Session Timeout" helperText="Minutes, 5 to 1440." error={errors.security?.sessionTimeoutMinutes?.message} {...register("security.sessionTimeoutMinutes", { valueAsNumber: true })} />
        <Input type="number" label="Login Attempt Limit" helperText="1 to 20 attempts." error={errors.security?.loginAttemptLimit?.message} {...register("security.loginAttemptLimit", { valueAsNumber: true })} />
        <Input type="number" label="Minimum Password Length" helperText="8 to 64 characters." error={errors.security?.minimumPasswordLength?.message} {...register("security.minimumPasswordLength", { valueAsNumber: true })} />
      </div>
      <div className="mt-5 divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
        <ToggleField name="security.requirePasswordUppercase" label="Require uppercase letter" />
        <ToggleField name="security.requirePasswordNumber" label="Require number" />
        <ToggleField name="security.requirePasswordSymbol" label="Require symbol" />
        <ToggleField name="security.twoFactorRequired" label="Require two factor authentication" />
      </div>
    </SettingsCard>
  );
}

function SeoSettingsSection() {
  const { register, formState: { errors } } = useFormContext<AdminSettingsFormValues>();

  return (
    <SettingsCard title="SEO Settings" description="Default metadata used when pages do not define their own values." icon={<Search className="size-5" aria-hidden="true" />}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Default SEO Title" helperText="Recommended max: 70 characters." error={errors.seo?.defaultSeoTitle?.message} {...register("seo.defaultSeoTitle")} />
        <Input label="Open Graph Title" error={errors.seo?.openGraphTitle?.message} {...register("seo.openGraphTitle")} />
        <Textarea label="Default SEO Description" rows={3} helperText="Recommended max: 160 characters." error={errors.seo?.defaultSeoDescription?.message} {...register("seo.defaultSeoDescription")} />
        <Textarea label="Open Graph Description" rows={3} error={errors.seo?.openGraphDescription?.message} {...register("seo.openGraphDescription")} />
        <Input wrapperClassName="md:col-span-2" label="Open Graph Image" placeholder="https://..." error={errors.seo?.openGraphImage?.message} {...register("seo.openGraphImage")} />
      </div>
    </SettingsCard>
  );
}

function AuditLogPanel({ settings }: { settings?: AdminSystemSettings }) {
  const auditLog = settings?.auditLog ?? [];

  return (
    <Card header={<div><h2 className="text-lg font-semibold text-foreground">Audit Log</h2><p className="mt-1 text-sm text-muted">Recent configuration changes.</p></div>}>
      {auditLog.length ? (
        <div className="space-y-4">
          {auditLog.map((item, index) => (
            <div key={`${item.action}-${item.createdAt}-${index}`} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0 dark:border-slate-700">
              <p className="text-sm font-semibold text-foreground">{item.userEmail ?? "System"}</p>
              <p className="mt-1 text-sm text-muted">{item.summary}</p>
              <p className="mt-2 text-xs text-muted">{item.category} - {formatDate(item.createdAt)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No audit entries yet.</p>
      )}
      <Button variant="ghost" className="mt-4 px-0" disabled>View All</Button>
    </Card>
  );
}

function EnvironmentStatsPanel({ settings }: { settings?: AdminSystemSettings }) {
  const environment = settings?.environment;

  return (
    <Card header={<div><h2 className="text-lg font-semibold text-foreground">Environment</h2><p className="mt-1 text-sm text-muted">Runtime health and deployment context.</p></div>}>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-3"><span className="text-muted">Framework</span><span className="font-medium text-foreground">{environment?.frameworkVersion ?? "Unknown"}</span></div>
        <div className="flex justify-between gap-3"><span className="text-muted">API Latency</span><span className="font-medium text-foreground">{environment?.apiLatencyMs ?? 0}ms</span></div>
        <div className="flex justify-between gap-3"><span className="text-muted">Last Reboot</span><span className="font-medium text-foreground">{formatDate(environment?.lastReboot)}</span></div>
        <div className="flex justify-between gap-3"><span className="text-muted">System Health</span><AdminStatusBadge status={environment?.systemHealth ?? "operational"} /></div>
      </div>
    </Card>
  );
}

function ConfigurationSummary({ settings }: { settings?: AdminSystemSettings }) {
  const metrics = useMemo(() => [
    { key: "maintenance", label: "Maintenance", value: settings?.platform.maintenanceMode ? "On" : "Off", tone: settings?.platform.maintenanceMode ? "danger" : "secondary" },
    { key: "registration", label: "Registration", value: settings?.platform.publicRegistrationEnabled ? "Open" : "Closed", tone: "primary" },
    { key: "analytics", label: "Analytics", value: settings?.analytics.analyticsEnabled ? "Enabled" : "Disabled", tone: "tertiary" },
  ] as const, [settings]);

  return (
    <div className="grid gap-3">
      {metrics.map((metric) => (
        <DashboardMetricCard key={metric.key} label={metric.label} value={metric.value} tone={metric.tone} />
      ))}
    </div>
  );
}

export default function SystemSettingsPage() {
  const settingsQuery = useAdminSettings();
  const { resetMutation, updateMutation } = useAdminSettingsMutations();
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const methods = useForm<AdminSettingsFormValues>({
    resolver: zodResolver(adminSettingsSchema),
    defaultValues: defaultSettings,
    mode: "onBlur",
  });
  const { formState: { isDirty }, handleSubmit, reset } = methods;

  useEffect(() => {
    if (settingsQuery.data) {
      reset(settingsQuery.data);
    }
  }, [reset, settingsQuery.data]);

  function handleSave(values: AdminSettingsFormValues) {
    setSuccessMessage("");
    setActionError("");
    updateMutation.mutate(values, {
      onSuccess: (settings) => {
        reset(settings);
        setSuccessMessage("System settings saved successfully.");
      },
      onError: (error) => setActionError(getApiErrorMessage(error) || "Unable to save settings."),
    });
  }

  function handleResetDefaults() {
    setSuccessMessage("");
    setActionError("");
    resetMutation.mutate(undefined, {
      onSuccess: (settings) => {
        reset(settings);
        setSuccessMessage("System settings reset to defaults.");
      },
      onError: (error) => setActionError(getApiErrorMessage(error) || "Unable to reset settings."),
    });
  }

  function handleDiscard() {
    reset(settingsQuery.data ?? defaultSettings);
    setSuccessMessage("");
    setActionError("");
  }

  if (settingsQuery.isLoading) {
    return (
      <main className="space-y-5 p-4 sm:p-6">
        <LoadingSkeleton variant="card" />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <LoadingSkeleton variant="card" className="min-h-96" />
          <LoadingSkeleton variant="card" className="min-h-96" />
        </div>
      </main>
    );
  }

  if (settingsQuery.isError) {
    return (
      <main className="p-4 sm:p-6">
        <ErrorState title="Settings unavailable" message="System settings could not be loaded." onRetry={() => settingsQuery.refetch()} />
      </main>
    );
  }

  return (
    <main className="p-4 pb-28 sm:p-6 sm:pb-28">
      <FormProvider {...methods}>
        <form className="mx-auto flex max-w-7xl flex-col gap-5" onSubmit={handleSubmit(handleSave)}>
          <header className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Admin Console</p>
                <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">System Settings</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  Manage global platform configuration, authentication behavior, moderation gates, notification defaults, security controls, SEO metadata, and analytics settings.
                </p>
              </div>
              <AdminStatusBadge status={settingsQuery.data?.platform.maintenanceMode ? "maintenance" : "operational"} />
            </div>
            {successMessage ? <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{successMessage}</div> : null}
            {actionError ? <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{actionError}</div> : null}
          </header>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <GeneralSettingsSection />
              <ToggleSettingsSection title="Platform Settings" description="Control public availability and platform modules." icon={<Activity className="size-5" aria-hidden="true" />} fields={[
                { name: "platform.maintenanceMode", label: "Maintenance Mode" },
                { name: "platform.publicRegistrationEnabled", label: "Public Registration Enabled" },
                { name: "platform.employerRegistrationEnabled", label: "Employer Registration Enabled" },
                { name: "platform.jobPostingEnabled", label: "Job Posting Enabled" },
                { name: "platform.blogModuleEnabled", label: "Blog Module Enabled" },
              ]} />
              <ToggleSettingsSection title="Authentication Settings" description="Manage enabled sign-in and account recovery methods." icon={<ShieldCheck className="size-5" aria-hidden="true" />} fields={[
                { name: "authentication.emailLoginEnabled", label: "Email Login Enabled" },
                { name: "authentication.googleLoginEnabled", label: "Google Login Enabled" },
                { name: "authentication.passwordResetEnabled", label: "Password Reset Enabled" },
                { name: "authentication.emailVerificationRequired", label: "Email Verification Required" },
              ]} />
              <ToggleSettingsSection title="User Registration Settings" description="Control job seeker onboarding requirements." icon={<Users className="size-5" aria-hidden="true" />} fields={[
                { name: "registration.autoApproveJobSeekers", label: "Auto Approve Job Seekers" },
                { name: "registration.requireProfileCompletion", label: "Require Profile Completion" },
                { name: "registration.resumeUploadRequirement", label: "Resume Upload Requirement" },
              ]} />
              <ToggleSettingsSection title="Employer Approval Settings" description="Control company and employer verification gates." icon={<Building2 className="size-5" aria-hidden="true" />} fields={[
                { name: "employerApproval.employerVerificationRequired", label: "Employer Verification Required" },
                { name: "employerApproval.manualEmployerApproval", label: "Manual Employer Approval" },
                { name: "employerApproval.companyVerificationRequired", label: "Company Verification Required" },
              ]} />
              <ToggleSettingsSection title="Job Approval Settings" description="Control job publishing and featured listing requirements." icon={<BriefcaseBusiness className="size-5" aria-hidden="true" />} fields={[
                { name: "jobApproval.manualJobApproval", label: "Manual Job Approval" },
                { name: "jobApproval.autoPublishJobs", label: "Auto Publish Jobs" },
                { name: "jobApproval.featuredJobRequirements", label: "Featured Job Requirements" },
              ]} />
              <ToggleSettingsSection title="Blog Settings" description="Manage editorial publishing and engagement modules." icon={<FileText className="size-5" aria-hidden="true" />} fields={[
                { name: "blog.blogPublishingEnabled", label: "Blog Publishing Enabled" },
                { name: "blog.commentingEnabled", label: "Commenting Enabled" },
                { name: "blog.featuredBlogsEnabled", label: "Featured Blogs Enabled" },
              ]} />
              <ToggleSettingsSection title="Notification Settings" description="Control platform notification categories." icon={<Bell className="size-5" aria-hidden="true" />} fields={[
                { name: "notifications.emailNotifications", label: "Email Notifications" },
                { name: "notifications.applicationNotifications", label: "Application Notifications" },
                { name: "notifications.interviewNotifications", label: "Interview Notifications" },
                { name: "notifications.adminNotifications", label: "Admin Notifications" },
              ]} />
              <EmailSettingsSection />
              <SecuritySettingsSection />
              <SeoSettingsSection />
              <ToggleSettingsSection title="Analytics Settings" description="Control tracking and reporting behavior." icon={<CheckCircle2 className="size-5" aria-hidden="true" />} fields={[
                { name: "analytics.analyticsEnabled", label: "Analytics Enabled" },
                { name: "analytics.trackingEnabled", label: "Tracking Controls" },
                { name: "analytics.anonymizeIp", label: "Anonymize IP Addresses" },
                { name: "analytics.reportingEnabled", label: "Reporting Options" },
              ]} />
            </div>

            <aside className="space-y-5">
              <AuditLogPanel settings={settingsQuery.data} />
              <EnvironmentStatsPanel settings={settingsQuery.data} />
              <Card header={<div><h2 className="text-lg font-semibold text-foreground">Configuration Summary</h2><p className="mt-1 text-sm text-muted">Current critical platform switches.</p></div>}>
                <ConfigurationSummary settings={settingsQuery.data} />
                <div className="mt-5 grid gap-2 text-sm">
                  <Link className="rounded-md border border-slate-200 px-3 py-2 font-semibold text-foreground transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" href="/admin/dashboard">Admin Dashboard</Link>
                  <Link className="rounded-md border border-slate-200 px-3 py-2 font-semibold text-foreground transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" href="/admin/analytics">Analytics</Link>
                  <Link className="rounded-md border border-slate-200 px-3 py-2 font-semibold text-foreground transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" href="/admin/reports">Reports</Link>
                  <span className="rounded-md border border-slate-200 px-3 py-2 font-semibold text-muted dark:border-slate-700">Notification Management</span>
                  <span className="rounded-md border border-slate-200 px-3 py-2 font-semibold text-muted dark:border-slate-700">Security Settings</span>
                </div>
              </Card>
            </aside>
          </div>

          <footer className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-background/95 px-4 py-4 backdrop-blur dark:border-slate-700 sm:mx-0 sm:rounded-lg sm:border sm:bg-surface sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">{isDirty ? "You have unsaved changes." : "All system settings are up to date."}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" leftIcon={<RefreshCcw className="size-4" aria-hidden="true" />} onClick={handleResetDefaults} isLoading={resetMutation.isPending}>Reset Defaults</Button>
                <Button type="button" variant="outline" leftIcon={<Undo2 className="size-4" aria-hidden="true" />} onClick={handleDiscard} disabled={!isDirty || updateMutation.isPending}>Discard Changes</Button>
                <Button type="submit" leftIcon={<Save className="size-4" aria-hidden="true" />} isLoading={updateMutation.isPending}>Save Changes</Button>
              </div>
            </div>
          </footer>
        </form>
      </FormProvider>
    </main>
  );
}
