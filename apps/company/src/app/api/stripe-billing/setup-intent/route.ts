import type { components } from "@quarry/api-types";
import { withAuthenticatedBackendRequest } from "@quarry/shared-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";

type BillingCreateSetupIntentDto =
  components["schemas"]["BillingCreateSetupIntentDto"];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BillingCreateSetupIntentDto;

  const { planCode, billingEmail } = body;

  if (!planCode || typeof planCode !== "string") {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "planCode is required and must be a string",
        },
      },
      {
        status: 400,
      },
    );
  }

  const result = await withAuthenticatedBackendRequest((accessToken) =>
    apiClient.POST("/api/billing/setup-intent", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        planCode: planCode,
        billingEmail,
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
