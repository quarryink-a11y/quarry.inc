import { withAuthenticatedBackendRequest } from "@quarry/shared-auth";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";

export async function GET() {
  const result = await withAuthenticatedBackendRequest((accessToken) =>
    apiClient.GET("/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  );

  if (!result.ok) {
    const response = NextResponse.json({ user: null }, { status: 200 });
    if (result.shouldClearCookies) clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json(
    { user: result.backend.data.user },
    { status: 200 },
  );

  if (result.refreshedTokens) {
    setAuthCookies(response, result.refreshedTokens);
  }

  return response;
}
