import { orderKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type { Order } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/catalogs/orders");
      if (error || !data) throw new Error("Failed to load orders");
      return data as Order[];
    },
  });
}
