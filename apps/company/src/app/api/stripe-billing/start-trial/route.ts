import type { BillingStartTrialDto } from "@quarry/api-types";
import { withAuthenticatedBackendRequest } from "@quarry/shared-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as BillingStartTrialDto;
  const { paymentMethodId, planCode, billingEmail } = body;

  if (
    !paymentMethodId ||
    typeof paymentMethodId !== "string" ||
    !planCode ||
    typeof planCode !== "string"
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            "paymentMethodId and planCode are required and must be strings",
        },
      },
      {
        status: 400,
      },
    );
  }

  const result = await withAuthenticatedBackendRequest((accessToken) =>
    apiClient.POST("/api/billing/start-trial", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        paymentMethodId,
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
      // Clear auth cookies if the error indicates an authentication issue
      clearAuthCookies(response);
    }
    return response;
  }

  const response = NextResponse.json(result.backend.data, {
    status: result.backend.status,
  });

  // If tokens were refreshed during the request, set the new cookies
  if (result.refreshedTokens) {
    setAuthCookies(response, result.refreshedTokens);
  }

  return response;
}
