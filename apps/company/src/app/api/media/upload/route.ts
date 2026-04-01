import { withAuthenticatedBackendRequest } from "@quarry/shared-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const result = await withAuthenticatedBackendRequest((accessToken) =>
    apiClient.POST("/api/media/upload", {
      body: formData as any,
      bodySerializer: (body) => body as unknown as FormData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
