"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  emailPreferencesQueryKeys,
  getEmailPreferences,
  updateEmailPreferences,
} from "@/services/emailPreferencesService";

export function useEmailPreferences() {
  return useQuery({
    queryKey: emailPreferencesQueryKeys.all,
    queryFn: getEmailPreferences,
  });
}

export function useUpdateEmailPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmailPreferences,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: emailPreferencesQueryKeys.all,
      });
    },
  });
}
