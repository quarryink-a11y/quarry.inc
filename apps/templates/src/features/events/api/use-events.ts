import { eventKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type { CreateEventDto, UpdateEventDto } from "@shared/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useEvents() {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/events", {
        params: { query: { type: "DRAFT" } },
      });
      if (error || !data) throw new Error("Failed to load events");
      return data;
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateEventDto) => {
      const { data, error } = await apiClient.POST("/api/events", { body });
      if (error || !data) throw new Error("Failed to create event");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventKeys.list() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdateEventDto>) => {
      const { data, error } = await apiClient.PATCH("/api/events/{id}", {
        params: { path: { id } },
        body: updates,
      });
      if (error || !data) throw new Error("Failed to update event");
      return data;
    },
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: eventKeys.list() });
      await queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/events/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete event");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventKeys.list() });
    },
  });
}
