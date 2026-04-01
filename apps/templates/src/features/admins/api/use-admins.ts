import { adminKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type { Admin, CreateAdminDto, UpdateAdminDto } from "@shared/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAdmins() {
  return useQuery({
    queryKey: adminKeys.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/admins");
      if (error || !data) throw new Error("Failed to load admins");
      return data as Admin[];
    },
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateAdminDto) => {
      const { data, error } = await apiClient.POST("/api/admins", { body });
      if (error || !data) throw new Error("Failed to create admin");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.list() });
    },
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdateAdminDto>) => {
      const { data, error } = await apiClient.PATCH("/api/admins/{id}", {
        params: { path: { id } },
        body: updates as never,
      });
      if (error || !data) throw new Error("Failed to update admin");
      return data;
    },
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.list() });
      await queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
    },
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/admins/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete admin");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.list() });
    },
  });
}
