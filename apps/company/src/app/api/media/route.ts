import { withAuthenticatedBackendRequest } from "@quarry/shared-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";

export async function DELETE(req: NextRequest) {
  const publicId = new URL(req.url).searchParams.get("publicId");

  if (!publicId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "publicId query param is required",
        },
      },
      { status: 400 },
    );
  }

  const result = await withAuthenticatedBackendRequest((accessToken) =>
    apiClient.DELETE("/api/media", {
      params: { query: { publicId } },
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

  const response = NextResponse.json(result.backend.data, {
    status: result.backend.status,
  });

  if (result.refreshedTokens) {
    setAuthCookies(response, result.refreshedTokens);
  }

  return response;
}
