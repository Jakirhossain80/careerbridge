"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button, Card, Input, Textarea } from "@/components/ui";
import {
  jobSeekerProfileSchema,
  type JobSeekerProfileFormValues,
} from "@/lib/validations/job-seeker.schema";
import {
  getJobSeekerProfile,
  updateJobSeekerProfile,
} from "@/services/job-seeker.service";

const splitList = (value?: string) =>
  value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];

export default function ProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["job-seeker-profile"],
    queryFn: getJobSeekerProfile,
  });

  const form = useForm<JobSeekerProfileFormValues>({
    resolver: zodResolver(jobSeekerProfileSchema) as never,
    values: {
      fullName: profile?.fullName ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      location: profile?.location ?? "",
      headline: profile?.headline ?? "",
      about: profile?.about ?? "",
      skillsText: profile?.skills?.join(", ") ?? "",
      experienceLevel: profile?.experienceLevel ?? "",
      portfolioUrl: profile?.portfolioUrl ?? "",
      linkedinUrl: profile?.linkedinUrl ?? "",
      githubUrl: profile?.githubUrl ?? "",
      preferredJobTypesText: profile?.preferredJobTypes?.join(", ") ?? "",
      preferredWorkModesText: profile?.preferredWorkModes?.join(", ") ?? "",
      expectedSalaryMin: profile?.expectedSalaryMin,
      expectedSalaryMax: profile?.expectedSalaryMax,
    },
  });

  const mutation = useMutation({
    mutationFn: updateJobSeekerProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["job-seeker-profile"] });
      router.push("/profile");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      location: values.location,
      headline: values.headline,
      about: values.about,
      skills: splitList(values.skillsText),
      experienceLevel: values.experienceLevel,
      portfolioUrl: values.portfolioUrl || undefined,
      linkedinUrl: values.linkedinUrl || undefined,
      githubUrl: values.githubUrl || undefined,
      preferredJobTypes: splitList(values.preferredJobTypesText),
      preferredWorkModes: splitList(values.preferredWorkModesText),
      expectedSalaryMin: values.expectedSalaryMin,
      expectedSalaryMax: values.expectedSalaryMax,
    });
  });

  return (
    <Card header={<h2 className="text-xl font-bold">Edit profile</h2>}>
      <form onSubmit={onSubmit} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Full name" {...form.register("fullName")} error={form.formState.errors.fullName?.message} />
          <Input label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
          <Input label="Phone" {...form.register("phone")} />
          <Input label="Location" {...form.register("location")} />
        </div>
        <Input label="Headline" {...form.register("headline")} />
        <Textarea label="About" {...form.register("about")} />
        <Input label="Skills" helperText="Comma-separated" {...form.register("skillsText")} />
        <div className="grid gap-5 md:grid-cols-3">
          <Input label="Portfolio URL" {...form.register("portfolioUrl")} error={form.formState.errors.portfolioUrl?.message} />
          <Input label="LinkedIn URL" {...form.register("linkedinUrl")} error={form.formState.errors.linkedinUrl?.message} />
          <Input label="GitHub URL" {...form.register("githubUrl")} error={form.formState.errors.githubUrl?.message} />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Input label="Experience level" {...form.register("experienceLevel")} />
          <Input label="Expected salary min" type="number" {...form.register("expectedSalaryMin")} />
          <Input label="Expected salary max" type="number" {...form.register("expectedSalaryMax")} />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Preferred job types" helperText="Comma-separated" {...form.register("preferredJobTypesText")} />
          <Input label="Preferred work modes" helperText="Comma-separated" {...form.register("preferredWorkModesText")} />
        </div>
        {mutation.error ? <p className="text-sm text-red-600">Profile update failed.</p> : null}
        <div className="flex justify-end">
          <Button type="submit" isLoading={mutation.isPending}>Save profile</Button>
        </div>
      </form>
    </Card>
  );
}
