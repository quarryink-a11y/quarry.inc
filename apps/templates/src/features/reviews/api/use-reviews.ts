import { reviewKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type { CreateReviewDto, UpdateReviewDto } from "@shared/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useReviews() {
  return useQuery({
    queryKey: reviewKeys.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/reviews", {
        params: { query: { type: "DRAFT" } },
      });
      if (error || !data) throw new Error("Failed to load reviews");
      return data;
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateReviewDto) => {
      const { data, error } = await apiClient.POST("/api/reviews", { body });
      if (error || !data) throw new Error("Failed to create review");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reviewKeys.list() });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdateReviewDto>) => {
      const { data, error } = await apiClient.PATCH("/api/reviews/{id}", {
        params: { path: { id } },
        body: updates,
      });
      if (error || !data) throw new Error("Failed to update review");
      return data;
    },
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: reviewKeys.list() });
      await queryClient.invalidateQueries({ queryKey: reviewKeys.detail(id) });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/reviews/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete review");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reviewKeys.list() });
    },
  });
}
