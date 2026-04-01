import { apiClient } from "@shared/lib/api-client";
import { clearAuthCookies, setAuthCookies } from "@shared/lib/auth-cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const { data, response } = await apiClient.POST("/api/auth/refresh", {
    body: { refreshToken },
  });

  const res = NextResponse.json(data ?? {}, { status: response.status });

  if (response.ok && data?.accessToken && data?.refreshToken) {
    setAuthCookies(res, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  } else {
    clearAuthCookies(res);
  }

  return res;
}
