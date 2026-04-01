import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { setAuthCookies } from "@/lib/auth-cookies";

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as {
    email: string;
    password: string;
  };

  const { data, error, response } = await apiClient.POST("/api/auth/login", {
    body: { email, password },
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
