import { apiClient } from "@shared/lib/api-client";
import { setAuthCookies } from "@shared/lib/auth-cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { idToken } = (await req.json()) as { idToken: string };

  const { data, error, response } = await apiClient.POST("/api/auth/apple", {
    body: { idToken, mode: "login_only" },
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
