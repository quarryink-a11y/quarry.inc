"use client";

import type { components } from "@quarry/api-types";
import { apiClient } from "@shared/lib/api-client";
import { useMutation } from "@tanstack/react-query";

type MediaUploadResult = components["schemas"]["MediaUploadResponseDto"];

/** Upload a single file to Cloudinary via backend. */
export function useMediaUpload() {
  return useMutation({
    mutationFn: async (file: File): Promise<MediaUploadResult> => {
      const { data, error } = await apiClient.POST("/api/media/upload", {
        body: { files: "" } as never,
        bodySerializer: () => {
          const formData = new FormData();
          formData.append("files", file);
          return formData;
        },
      });

      if (error || !data) throw new Error("Upload failed");

      // Backend returns array, we uploaded 1 file
      const results = data as unknown as MediaUploadResult[];
      return results[0];
    },
  });
}

/** Delete a media file by Cloudinary publicId. */
export function useMediaDelete() {
  return useMutation({
    mutationFn: async (publicId: string): Promise<void> => {
      const { error } = await apiClient.DELETE("/api/media", {
        params: { query: { publicId } },
      });
      if (error) throw new Error("Failed to delete media");
    },
  });
}
