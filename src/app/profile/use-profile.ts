"use client";

import { useQuery } from "@tanstack/react-query";
import { AuthService, useCustomerAuthStore } from "@/shared/auth";

export function useProfile() {
  const { setAuth, user, accessToken, refreshToken } = useCustomerAuthStore();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await AuthService.getProfile();
      if (response.success && user && accessToken && refreshToken) {
        setAuth({
          ...user,
          ...response.data,
          accessToken,
          refreshToken,
        });
      }
      return response.data;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}
