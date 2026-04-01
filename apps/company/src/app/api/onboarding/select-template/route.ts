import { withAuthenticatedBackendRequest } from "@quarry/shared-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";

interface SelectTemplateRequestBody {
  onboardingTemplateId: string;
}
export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as SelectTemplateRequestBody;
  const { onboardingTemplateId } = body;

  if (!onboardingTemplateId || typeof onboardingTemplateId !== "string") {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "onboardingTemplateId is required",
        },
      },
      { status: 400 },
    );
  }

  const result = await withAuthenticatedBackendRequest((accessToken) =>
    apiClient.PATCH("/api/onboarding/select-template", {
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { onboardingTemplateId },
    }),
  );

  if (!result.ok) {
    const response = NextResponse.json(result.backend.error, {
      status: result.backend.status,
    });
    if (result.shouldClearCookies) clearAuthCookies(response);
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
