"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Save } from "lucide-react";

import CompanyBiographyForm from "@/components/employer-company-profile/edit/CompanyBiographyForm";
import CompanyBrandingEditor from "@/components/employer-company-profile/edit/CompanyBrandingEditor";
import CompanyKeyDetailsForm from "@/components/employer-company-profile/edit/CompanyKeyDetailsForm";
import CompanyPublicPreview from "@/components/employer-company-profile/edit/CompanyPublicPreview";
import MobileSaveBar from "@/components/employer-company-profile/edit/MobileSaveBar";
import { Button, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import { appToast } from "@/lib/toast";
import {
  createEmployerCompanyProfile,
  employerCompanyProfileQueryKeys,
  updateEmployerCompanyProfile,
  uploadEmployerCompanyBanner,
  uploadEmployerCompanyLogo,
  type EmployerCompanyProfileUpdatePayload,
} from "@/services/employer-company-profile.service";
import type { CompanyProfile } from "@/lib/employer-company-profile-data";

type EditCompanyProfileFormProps = {
  company: CompanyProfile;
};

export type CompanyProfileFormData = Pick<
  CompanyProfile,
  | "id"
  | "companyName"
  | "slug"
  | "logoUrl"
  | "bannerUrl"
  | "tagline"
  | "about"
  | "industry"
  | "companySize"
  | "website"
  | "headquarters"
  | "contactEmail"
  | "phone"
  | "address"
  | "socialLinks"
  | "benefits"
  | "culture"
  | "hiringStatus"
  | "profileCompletionPercentage"
>;

function toFormData(company: CompanyProfile): CompanyProfileFormData {
  return {
    id: company.id,
    companyName: company.companyName,
    slug: company.slug,
    logoUrl: company.logoUrl,
    bannerUrl: company.bannerUrl,
    tagline: company.tagline,
    about: company.about,
    industry: company.industry,
    companySize: company.companySize,
    website: company.website,
    headquarters: company.headquarters,
    contactEmail: company.contactEmail,
    phone: company.phone,
    address: company.address,
    socialLinks: company.socialLinks,
    benefits: company.benefits,
    culture: company.culture,
    hiringStatus: company.hiringStatus,
    profileCompletionPercentage: company.profileCompletionPercentage,
  };
}

export default function EditCompanyProfileForm({
  company,
}: EditCompanyProfileFormProps) {
  const queryClient = useQueryClient();
  const initialFormData = useMemo(() => toFormData(company), [company]);
  const [formData, setFormData] =
    useState<CompanyProfileFormData>(initialFormData);
  const [saveState, setSaveState] = useState<"idle" | "success">("idle");
  const hasCompanyProfile = Boolean(company.id);

  function updateField<Key extends keyof CompanyProfileFormData>(
    key: Key,
    value: CompanyProfileFormData[Key],
  ) {
    setFormData((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  }

  async function syncCompanyCaches(updatedCompany: CompanyProfile) {
    queryClient.setQueryData(
      employerCompanyProfileQueryKeys.detail,
      updatedCompany,
    );
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: employerCompanyProfileQueryKeys.detail,
      }),
      queryClient.invalidateQueries({
        queryKey: employerCompanyProfileQueryKeys.dashboard,
      }),
    ]);
  }

  const saveMutation = useMutation({
    mutationFn: (payload: EmployerCompanyProfileUpdatePayload) =>
      hasCompanyProfile
        ? updateEmployerCompanyProfile(payload)
        : createEmployerCompanyProfile(payload),
    onSuccess: async (updatedCompany) => {
      setFormData((current) => ({
        ...toFormData(updatedCompany),
        tagline: current.tagline,
      }));
      setSaveState("success");
      await syncCompanyCaches(updatedCompany);
      appToast.success("Company profile saved successfully.");
    },
    onError: (error) => {
      setSaveState("idle");
      appToast.error(getApiErrorMessage(error));
    },
  });

  const logoMutation = useMutation({
    mutationFn: (file: File) => {
      const uploadData = new FormData();
      uploadData.append("logo", file);
      return uploadEmployerCompanyLogo(uploadData);
    },
    onSuccess: async (updatedCompany) => {
      updateField("logoUrl", updatedCompany.logoUrl);
      await syncCompanyCaches(updatedCompany);
      appToast.success("Company logo updated successfully.");
    },
    onError: (error) => {
      appToast.error(getApiErrorMessage(error));
    },
  });

  const bannerMutation = useMutation({
    mutationFn: (file: File) => {
      const uploadData = new FormData();
      uploadData.append("banner", file);
      return uploadEmployerCompanyBanner(uploadData);
    },
    onSuccess: async (updatedCompany) => {
      updateField("bannerUrl", updatedCompany.bannerUrl);
      await syncCompanyCaches(updatedCompany);
      appToast.success("Company banner updated successfully.");
    },
    onError: (error) => {
      appToast.error(getApiErrorMessage(error));
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveState("idle");
    saveMutation.mutate({
      companyName: formData.companyName,
      website: formData.website || undefined,
      industry: formData.industry || undefined,
      companySize: formData.companySize || undefined,
      headquarters: formData.headquarters || undefined,
      tagline: formData.tagline,
      description: formData.about,
      logoUrl: formData.logoUrl || undefined,
      bannerUrl: formData.bannerUrl || undefined,
    });
  }

  return (
    <>
      <form
        id="company-profile-edit-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Employer workspace
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Edit company profile
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Update the public company details candidates see before applying.
              Changes are saved to your company profile after submission.
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <Link
              href="/employer/dashboard/company-profile"
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-600 dark:bg-transparent dark:text-white dark:hover:bg-slate-800"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              isLoading={saveMutation.isPending}
              leftIcon={<Save className="size-4" aria-hidden="true" />}
            >
              Save Changes
            </Button>
          </div>
        </header>

        {saveState === "success" ? (
          <div
            className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              Company profile changes were saved successfully.
            </span>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-6">
            <CompanyBrandingEditor
              companyName={formData.companyName}
              logoUrl={formData.logoUrl}
              bannerUrl={formData.bannerUrl}
              isLogoUploading={logoMutation.isPending}
              isBannerUploading={bannerMutation.isPending}
              onLogoUpload={(file) => logoMutation.mutate(file)}
              onBannerUpload={(file) => bannerMutation.mutate(file)}
            />

            <section
              aria-labelledby="basic-company-info-heading"
              className="rounded-lg border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-700"
            >
              <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
                <h2
                  id="basic-company-info-heading"
                  className="text-lg font-semibold text-foreground"
                >
                  Basic company information
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Keep your company identity and primary candidate destination
                  up to date.
                </p>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Input
                  label="Company name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={(event) =>
                    updateField("companyName", event.target.value)
                  }
                  autoComplete="organization"
                  required
                />
                <Input
                  label="Website URL"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={(event) => updateField("website", event.target.value)}
                  autoComplete="url"
                  required
                />
              </div>
            </section>

            <CompanyBiographyForm
              tagline={formData.tagline}
              about={formData.about}
              onTaglineChange={(value) => updateField("tagline", value)}
              onAboutChange={(value) => updateField("about", value)}
            />

            <CompanyKeyDetailsForm
              industry={formData.industry}
              companySize={formData.companySize}
              headquarters={formData.headquarters}
              onIndustryChange={(value) => updateField("industry", value)}
              onCompanySizeChange={(value) => updateField("companySize", value)}
              onHeadquartersChange={(value) => updateField("headquarters", value)}
            />
          </div>

          <aside className="flex flex-col gap-6" aria-label="Public profile preview">
            <CompanyPublicPreview company={formData} />
          </aside>
        </div>
      </form>

      <MobileSaveBar
        cancelHref="/employer/dashboard/company-profile"
        isSaving={saveMutation.isPending}
      />
    </>
  );
}
