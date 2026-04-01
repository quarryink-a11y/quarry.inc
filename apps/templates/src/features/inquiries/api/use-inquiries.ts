import { inquiryKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type { CreateInquiryDto, UpdateInquiryDto } from "@shared/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useInquiries() {
  return useQuery({
    queryKey: inquiryKeys.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/inquiries");
      if (error || !data) throw new Error("Failed to load inquiries");
      return data;
    },
  });
}

export function useInquiry(id: string) {
  return useQuery({
    queryKey: inquiryKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/inquiries/{id}", {
        params: { path: { id } },
      });
      if (error || !data) throw new Error("Failed to load inquiry");
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateInquiryDto) => {
      const { data, error } = await apiClient.POST("/api/inquiries", { body });
      if (error || !data) throw new Error("Failed to create inquiry");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: inquiryKeys.list() });
    },
  });
}

export function useUpdateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdateInquiryDto>) => {
      const { data, error } = await apiClient.PATCH("/api/inquiries/{id}", {
        params: { path: { id } },
        body: updates,
      });
      if (error || !data) throw new Error("Failed to update inquiry");
      return data;
    },
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: inquiryKeys.list() });
      await queryClient.invalidateQueries({ queryKey: inquiryKeys.detail(id) });
    },
  });
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/inquiries/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete inquiry");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: inquiryKeys.list() });
    },
  });
}
