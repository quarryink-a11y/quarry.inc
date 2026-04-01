import { withAuthenticatedBackendRequest } from "@quarry/shared-auth";
import { apiClient } from "@shared/lib/api-client";
import { clearAuthCookies, setAuthCookies } from "@shared/lib/auth-cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Returns { user, accessToken } — accessToken is used by the client-side
// apiClient middleware to authenticate direct backend calls (entity CRUD).
export async function GET() {
  const cookieStore = await cookies();
  const originalAccessToken = cookieStore.get("access_token")?.value ?? null;

  const result = await withAuthenticatedBackendRequest((accessToken) =>
    apiClient.GET("/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  );

  if (!result.ok) {
    const response = NextResponse.json(
      { user: null, accessToken: null },
      { status: 200 },
    );
    if (result.shouldClearCookies) clearAuthCookies(response);
    return response;
  }

  const usedToken = result.refreshedTokens?.accessToken ?? originalAccessToken;

  const response = NextResponse.json(
    { user: result.backend.data?.user ?? null, accessToken: usedToken },
    { status: 200 },
  );

  if (result.refreshedTokens) {
    setAuthCookies(response, result.refreshedTokens);
  }

  return response;
}
