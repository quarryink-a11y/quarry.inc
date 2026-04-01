import { designKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type { CreateDesignDto, UpdateDesignDto } from "@shared/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDesigns() {
  return useQuery({
    queryKey: designKeys.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/designs", {
        params: { query: { type: "DRAFT" } },
      });
      if (error || !data) throw new Error("Failed to load designs");
      return data;
    },
  });
}

export function useCreateDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateDesignDto) => {
      const { data, error } = await apiClient.POST("/api/designs", { body });
      if (error || !data) throw new Error("Failed to create design");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: designKeys.list() });
    },
  });
}

export function useUpdateDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdateDesignDto>) => {
      const { data, error } = await apiClient.PATCH("/api/designs/{id}", {
        params: { path: { id } },
        body: updates,
      });
      if (error || !data) throw new Error("Failed to update design");
      return data;
    },
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: designKeys.list() });
      await queryClient.invalidateQueries({ queryKey: designKeys.detail(id) });
    },
  });
}

export function useDeleteDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/designs/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete design");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: designKeys.list() });
    },
  });
}
