"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { Button, Card, Input, Textarea } from "@/components/ui";
import EditEducationSection from "@/components/job-seeker/profile/EditEducationSection";
import EditExperienceSection from "@/components/job-seeker/profile/EditExperienceSection";
import EditProfilePhotoCard from "@/components/job-seeker/profile/EditProfilePhotoCard";
import EditSkillsInput from "@/components/job-seeker/profile/EditSkillsInput";
import EditSocialLinksCard from "@/components/job-seeker/profile/EditSocialLinksCard";
import { jobSeekerDashboardQueryKeys } from "@/components/job-seeker/dashboard/JobSeekerDashboardContent";
import { jobSeekerProfileQueryKeys } from "@/components/job-seeker/profile/MyProfileContent";
import {
  jobSeekerProfileSchema,
  type JobSeekerProfileFormValues,
} from "@/lib/validations/job-seeker-profile.schema";
import { updateJobSeekerProfile } from "@/services/job-seeker-profile.service";
import type {
  JobSeekerProfile,
  JobSeekerProfileUpdatePayload,
} from "@/types/job-seeker-profile.types";

type EditProfileFormProps = {
  profile?: JobSeekerProfile;
};

function toFormValues(profile?: JobSeekerProfile): JobSeekerProfileFormValues {
  return {
    avatar: profile?.avatar ?? "",
    fullName: profile?.fullName ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    headline: profile?.headline ?? "",
    about: profile?.about ?? "",
    currentDesignation: profile?.currentDesignation ?? "",
    yearsOfExperience:
      profile?.yearsOfExperience !== undefined ? String(profile.yearsOfExperience) : "",
    preferredRole: profile?.preferredRole ?? "",
    technicalSkills: profile?.technicalSkills ?? [],
    softSkills: profile?.softSkills ?? [],
    linkedinUrl: profile?.linkedinUrl ?? "",
    githubUrl: profile?.githubUrl ?? "",
    portfolioUrl: profile?.portfolioUrl ?? "",
    experience:
      profile?.experience?.map((item) => ({
        _id: item._id,
        title: item.title ?? "",
        company: item.company ?? "",
        employmentType: item.employmentType ?? "",
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? "",
        currentlyWorking: item.currentlyWorking ?? false,
        location: item.location ?? "",
        description: item.description ?? "",
      })) ?? [],
    education:
      profile?.education?.map((item) => ({
        _id: item._id,
        degree: item.degree ?? "",
        institution: item.institution ?? "",
        fieldOfStudy: item.fieldOfStudy ?? "",
        graduationYear:
          item.graduationYear !== undefined ? String(item.graduationYear) : "",
      })) ?? [],
  };
}

function emptyToUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function calculateProfileCompletion(values: JobSeekerProfileFormValues) {
  const checks = [
    values.fullName,
    values.email,
    values.phone,
    values.location,
    values.headline,
    values.about,
    values.currentDesignation,
    values.preferredRole,
    values.technicalSkills?.length,
    values.softSkills?.length,
    values.experience?.length,
    values.education?.length,
    values.linkedinUrl || values.githubUrl || values.portfolioUrl,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

function toPayload(values: JobSeekerProfileFormValues): JobSeekerProfileUpdatePayload {
  return {
    avatar: emptyToUndefined(values.avatar),
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: emptyToUndefined(values.phone),
    location: emptyToUndefined(values.location),
    headline: emptyToUndefined(values.headline),
    about: emptyToUndefined(values.about),
    currentDesignation: emptyToUndefined(values.currentDesignation),
    yearsOfExperience: values.yearsOfExperience
      ? Number(values.yearsOfExperience)
      : undefined,
    preferredRole: emptyToUndefined(values.preferredRole),
    technicalSkills: values.technicalSkills ?? [],
    softSkills: values.softSkills ?? [],
    linkedinUrl: emptyToUndefined(values.linkedinUrl),
    githubUrl: emptyToUndefined(values.githubUrl),
    portfolioUrl: emptyToUndefined(values.portfolioUrl),
    profileCompletion: calculateProfileCompletion(values),
    experience:
      values.experience?.map((item) => ({
        _id: emptyToUndefined(item._id),
        title: item.title.trim(),
        company: item.company.trim(),
        employmentType: emptyToUndefined(item.employmentType),
        startDate: item.startDate ?? "",
        endDate: item.currentlyWorking ? undefined : emptyToUndefined(item.endDate),
        currentlyWorking: Boolean(item.currentlyWorking),
        location: emptyToUndefined(item.location),
        description: emptyToUndefined(item.description),
      })) ?? [],
    education:
      values.education?.map((item) => ({
        _id: emptyToUndefined(item._id),
        degree: item.degree.trim(),
        institution: item.institution.trim(),
        fieldOfStudy: emptyToUndefined(item.fieldOfStudy),
        graduationYear: item.graduationYear ? Number(item.graduationYear) : undefined,
      })) ?? [],
  };
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const defaultValues = useMemo(() => toFormValues(profile), [profile]);

  const form = useForm<JobSeekerProfileFormValues>({
    resolver: zodResolver(jobSeekerProfileSchema),
    defaultValues,
    mode: "onBlur",
  });

  const watchedAvatar = useWatch({ control: form.control, name: "avatar" });
  const watchedName = useWatch({ control: form.control, name: "fullName" });
  const technicalSkills =
    useWatch({ control: form.control, name: "technicalSkills" }) ?? [];
  const softSkills = useWatch({ control: form.control, name: "softSkills" }) ?? [];

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const mutation = useMutation({
    mutationFn: updateJobSeekerProfile,
    onSuccess: async (updatedProfile) => {
      setSubmitMessage("Profile updated successfully.");
      form.reset(toFormValues(updatedProfile));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: jobSeekerProfileQueryKeys.profile }),
        queryClient.invalidateQueries({ queryKey: jobSeekerProfileQueryKeys.stats }),
        queryClient.invalidateQueries({ queryKey: jobSeekerDashboardQueryKeys.dashboard }),
      ]);
    },
    onError: () => {
      setSubmitMessage(null);
    },
  });

  const completion = calculateProfileCompletion(form.getValues());
  const errors = form.formState.errors;

  function handleCancel() {
    if (
      form.formState.isDirty &&
      !window.confirm("Discard your unsaved profile changes?")
    ) {
      return;
    }

    router.push("/job-seeker/profile");
  }

  const onSubmit = form.handleSubmit((values) => {
    setSubmitMessage(null);
    mutation.mutate(toPayload(values));
  });

  return (
    <form id="job-seeker-edit-profile-form" onSubmit={onSubmit} className="space-y-6">
      <Card
        className="bg-surface"
        contentClassName="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h2 className="text-base font-semibold text-foreground">Profile editor</h2>
          <p className="mt-1 text-sm text-muted">
            Changes are saved to your job seeker profile.
          </p>
        </div>
        <div className="hidden flex-wrap gap-2 sm:flex">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            leftIcon={<Save className="size-4" aria-hidden="true" />}
          >
            Save Changes
          </Button>
        </div>
      </Card>

      {submitMessage ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          {submitMessage}
        </div>
      ) : null}

      {mutation.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          Unable to update profile. Please try again.
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <EditProfilePhotoCard
            avatar={watchedAvatar}
            fullName={watchedName}
            completion={profile?.profileCompletion ?? completion}
            error={errors.avatar?.message}
            register={form.register}
          />
          <EditSocialLinksCard errors={errors} register={form.register} />
          <Card
            header={
              <div>
                <h2 className="text-base font-semibold text-foreground">Profile shortcuts</h2>
                <p className="mt-1 text-sm text-muted">Review related job seeker pages.</p>
              </div>
            }
          >
            <div className="grid gap-2">
              <Link href="/job-seeker/profile" className="text-sm font-semibold text-primary">
                View public profile
              </Link>
              <Link href="/profile/resumes" className="text-sm font-semibold text-primary">
                Manage resume
              </Link>
              <Link href="/job-seeker/dashboard" className="text-sm font-semibold text-primary">
                Back to dashboard
              </Link>
            </div>
          </Card>
        </aside>

        <div className="space-y-6">
          <Card
            header={
              <div>
                <h2 className="text-base font-semibold text-foreground">Personal details</h2>
                <p className="mt-1 text-sm text-muted">Basic contact information shown to employers.</p>
              </div>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full name"
                error={errors.fullName?.message}
                {...form.register("fullName")}
              />
              <Input
                label="Email address"
                type="email"
                error={errors.email?.message}
                {...form.register("email")}
              />
              <Input label="Phone number" {...form.register("phone")} />
              <Input label="Location" placeholder="City, Country" {...form.register("location")} />
            </div>
          </Card>

          <Card
            header={
              <div>
                <h2 className="text-base font-semibold text-foreground">Professional info</h2>
                <p className="mt-1 text-sm text-muted">Summarize your role, strengths, and target jobs.</p>
              </div>
            }
          >
            <div className="space-y-4">
              <Input
                label="Professional headline"
                placeholder="Frontend Engineer building accessible SaaS products"
                {...form.register("headline")}
              />
              <Textarea
                label="About me / career summary"
                helperText="Maximum 2000 characters."
                error={errors.about?.message}
                {...form.register("about")}
              />
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Current designation"
                  {...form.register("currentDesignation")}
                />
                <Input
                  label="Years of experience"
                  inputMode="numeric"
                  placeholder="4"
                  {...form.register("yearsOfExperience")}
                />
                <Input
                  label="Preferred job role"
                  {...form.register("preferredRole")}
                />
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <EditSkillsInput
              title="Technical skills"
              description="Tools, frameworks, languages, and domain skills."
              skills={technicalSkills}
              onChange={(skills) =>
                form.setValue("technicalSkills", skills, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <EditSkillsInput
              title="Soft skills"
              description="Communication, ownership, leadership, and workplace strengths."
              skills={softSkills}
              onChange={(skills) =>
                form.setValue("softSkills", skills, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>

          <EditExperienceSection form={form} />
          <EditEducationSection form={form} />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:hidden">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            leftIcon={<ArrowLeft className="size-4" aria-hidden="true" />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={mutation.isPending}
            leftIcon={<Save className="size-4" aria-hidden="true" />}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
