import { catalogKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type {
  Catalog,
  CreateCatalogDto,
  UpdateCatalogDto,
} from "@shared/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCatalogs() {
  return useQuery({
    queryKey: catalogKeys.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/catalogs", {
        params: { query: { type: "DRAFT" } },
      });
      if (error || !data) throw new Error("Failed to load catalog items");
      return data as Catalog[];
    },
  });
}

export function useCreateCatalog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateCatalogDto) => {
      const { data, error } = await apiClient.POST("/api/catalogs", { body });
      if (error || !data) throw new Error("Failed to create catalog item");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: catalogKeys.list() });
    },
  });
}

export function useUpdateCatalog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdateCatalogDto>) => {
      const { data, error } = await apiClient.PATCH("/api/catalogs/{id}", {
        params: { path: { id } },
        body: updates,
      });
      if (error || !data) throw new Error("Failed to update catalog item");
      return data;
    },
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: catalogKeys.list() });
      await queryClient.invalidateQueries({
        queryKey: catalogKeys.detail(id),
      });
    },
  });
}

export function useDeleteCatalog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/catalogs/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete catalog item");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: catalogKeys.list() });
    },
  });
}
