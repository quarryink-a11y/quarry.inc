import { bookingStepKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import type {
  CreateBookingStepDto,
  UpdateBookingStepDto,
} from "@shared/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useBookingSteps() {
  return useQuery({
    queryKey: bookingStepKeys.list(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/booking-steps", {
        params: { query: { type: "DRAFT" } },
      });
      if (error || !data) throw new Error("Failed to load booking steps");
      return data;
    },
  });
}

export function useCreateBookingStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateBookingStepDto) => {
      const { data, error } = await apiClient.POST("/api/booking-steps", {
        body,
      });
      if (error || !data) throw new Error("Failed to create booking step");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookingStepKeys.list() });
    },
  });
}

export function useUpdateBookingStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<UpdateBookingStepDto>) => {
      const { data, error } = await apiClient.PATCH("/api/booking-steps/{id}", {
        params: { path: { id } },
        body: updates as never,
      });
      if (error || !data) throw new Error("Failed to update booking step");
      return data;
    },
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: bookingStepKeys.list() });
      await queryClient.invalidateQueries({
        queryKey: bookingStepKeys.detail(id),
      });
    },
  });
}

export function useDeleteBookingStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE("/api/booking-steps/{id}", {
        params: { path: { id } },
      });
      if (error) throw new Error("Failed to delete booking step");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookingStepKeys.list() });
    },
  });
}
