import { createApiClient } from "@quarry/api-client";

export const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
);
