import { createApiClient } from "@quarry/api-client";

import { createAuthHelper } from "./with-auth-back-response";

const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
);

export const withAuthenticatedBackendRequest = createAuthHelper(
  (refreshToken) =>
    apiClient.POST("/api/auth/refresh", { body: { refreshToken } }),
);
