import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";
import { clearAuthCookies } from "@/lib/auth-cookies";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    await apiClient.POST("/api/auth/logout", {
      body: { refreshToken },
    });
  }

  const response = new NextResponse(null, { status: 204 });
  clearAuthCookies(response);
  return response;
}
