import type { components } from "@quarry/api-types";
import { apiClient } from "@shared/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ProfileMeResponse = components["schemas"]["ProfileMeResponseDto"];
type UpdateProfileDto = components["schemas"]["UpdateProfileDto"];

export const profileKeys = {
  me: () => ["profile", "me"] as const,
} as const;

export function useProfileMe() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/api/profile/me");
      if (error || !data || !response.ok) {
        throw new Error("Failed to load profile");
      }
      return data as ProfileMeResponse;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<UpdateProfileDto>) => {
      const { data, error } = await apiClient.PATCH("/api/profile/me", {
        body: updates,
      });
      if (error || !data) throw new Error("Failed to update profile");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
}
