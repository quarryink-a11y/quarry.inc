import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { setAuthCookies } from "@/lib/auth-cookies";

export async function POST(req: NextRequest) {
  const { idToken } = (await req.json()) as { idToken: string };

  const { data, error, response } = await apiClient.POST("/api/auth/google", {
    body: { idToken, mode: "auto" as const },
  });

  const res = NextResponse.json(response.ok ? { user: data!.user } : error, {
    status: response.status,
  });

  if (response.ok && data?.accessToken && data?.refreshToken) {
    setAuthCookies(res, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  }

  return res;
}
