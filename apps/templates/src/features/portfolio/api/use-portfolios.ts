import { portfolioKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type { CreatePortfolioDto, UpdatePortfolioDto } from "@shared/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePortfolios() {
  return useQuery({
    queryKey: portfolioKeys.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/portfolios", {
        params: { query: { type: "DRAFT" } },
      });
      if (error || !data) throw new Error("Failed to load portfolios");
      return data;
    },
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreatePortfolioDto) => {
      const { data, error } = await apiClient.POST("/api/portfolios", { body });
      if (error || !data) throw new Error("Failed to create portfolio");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
    },
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdatePortfolioDto>) => {
      const { data, error } = await apiClient.PATCH("/api/portfolios/{id}", {
        params: { path: { id } },
        body: updates,
      });
      if (error || !data) throw new Error("Failed to update portfolio");
      return data;
    },
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
      await queryClient.invalidateQueries({
        queryKey: portfolioKeys.detail(id),
      });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/portfolios/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete portfolio");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.list() });
    },
  });
}
