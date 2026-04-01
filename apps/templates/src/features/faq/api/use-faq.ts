import { faqKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type {
  CreateFaqCategoryDto,
  CreateFaqItemDto,
  UpdateFaqCategoryDto,
  UpdateFaqItemDto,
} from "@shared/types/api";
import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const invalidateFaq = (qc: QueryClient) =>
  qc.invalidateQueries({ queryKey: faqKeys.categories() });

export function useFaqCategories() {
  return useQuery({
    queryKey: faqKeys.categories(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/faq/categories", {
        params: { query: { type: "DRAFT" } },
      });
      if (error || !data) throw new Error("Failed to load FAQ categories");
      return data;
    },
  });
}

export function useCreateFaqCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateFaqCategoryDto) => {
      const { data, error } = await apiClient.POST("/api/faq/categories", {
        body,
      });
      if (error || !data) throw new Error("Failed to create FAQ category");
      return data;
    },
    onSuccess: async () => {
      await invalidateFaq(queryClient);
    },
  });
}

export function useUpdateFaqCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdateFaqCategoryDto>) => {
      const { data, error } = await apiClient.PATCH(
        "/api/faq/categories/{id}",
        {
          params: { path: { id } },
          body: updates as never,
        },
      );
      if (error || !data) throw new Error("Failed to update FAQ category");
      return data;
    },
    onSuccess: async () => {
      await invalidateFaq(queryClient);
    },
  });
}

export function useDeleteFaqCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/faq/categories/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete FAQ category");
    },
    onSuccess: async () => {
      await invalidateFaq(queryClient);
    },
  });
}

export function useCreateFaqItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateFaqItemDto) => {
      const { data, error } = await apiClient.POST("/api/faq/items", { body });
      if (error || !data) throw new Error("Failed to create FAQ item");
      return data;
    },
    onSuccess: async () => {
      await invalidateFaq(queryClient);
    },
  });
}

export function useUpdateFaqItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdateFaqItemDto>) => {
      const { data, error } = await apiClient.PATCH("/api/faq/items/{id}", {
        params: { path: { id } },
        body: updates as never,
      });
      if (error || !data) throw new Error("Failed to update FAQ item");
      return data;
    },
    onSuccess: async () => {
      await invalidateFaq(queryClient);
    },
  });
}

export function useDeleteFaqItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/faq/items/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete FAQ item");
    },
    onSuccess: async () => {
      await invalidateFaq(queryClient);
    },
  });
}
