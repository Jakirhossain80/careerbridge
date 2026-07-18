"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteResume,
  getMyResumes,
  replaceResume,
  resumeQueryKeys,
  setDefaultResume,
  uploadResume,
} from "@/services/resumes.service";

export const useResumes = () => {
  const queryClient = useQueryClient();
  const invalidateResumeData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.profile }),
      queryClient.invalidateQueries({ queryKey: resumeQueryKeys.dashboard }),
    ]);
  };

  return {
    resumesQuery: useQuery({
      queryKey: resumeQueryKeys.manager,
      queryFn: getMyResumes,
    }),
    uploadMutation: useMutation({
      mutationFn: uploadResume,
      onSuccess: invalidateResumeData,
    }),
    replaceMutation: useMutation({
      mutationFn: ({ resumeId, formData }: { resumeId: string; formData: FormData }) =>
        replaceResume(resumeId, formData),
      onSuccess: invalidateResumeData,
    }),
    deleteMutation: useMutation({
      mutationFn: deleteResume,
      onSuccess: invalidateResumeData,
    }),
    defaultMutation: useMutation({
      mutationFn: setDefaultResume,
      onSuccess: invalidateResumeData,
    }),
  };
};
