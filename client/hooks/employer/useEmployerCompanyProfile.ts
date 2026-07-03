"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  employerCompanyProfileQueryKeys,
  getEmployerCompanyProfile,
} from "@/services/employer-company-profile.service";

export function useEmployerCompanyProfile() {
  return useQuery({
    queryKey: employerCompanyProfileQueryKeys.detail,
    queryFn: getEmployerCompanyProfile,
    retry: (_failureCount, error) => {
      return !(axios.isAxiosError(error) && error.response?.status === 404);
    },
  });
}
