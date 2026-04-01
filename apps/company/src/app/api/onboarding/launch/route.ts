import { withAuthenticatedBackendRequest } from "@quarry/shared-auth";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";

export async function POST() {
  const result = await withAuthenticatedBackendRequest((accessToken) =>
    apiClient.POST("/api/onboarding/launch", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  );

  if (!result.ok) {
    const response = NextResponse.json(result.backend.error, {
      status: result.backend.status,
    });
    if (result.shouldClearCookies) {
      clearAuthCookies(response);
    }
    return response;
  }

  const response = NextResponse.json(result.backend.data ?? null, {
    status: result.backend.status,
  });

  if (result.refreshedTokens) {
    setAuthCookies(response, result.refreshedTokens);
  }

  return response;
}
