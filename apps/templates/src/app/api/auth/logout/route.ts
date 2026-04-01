import { apiClient } from "@shared/lib/api-client";
import { clearAuthCookies } from "@shared/lib/auth-cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    await apiClient.POST("/api/auth/logout", { body: { refreshToken } });
  }

  const response = new NextResponse(null, { status: 204 });
  clearAuthCookies(response);
  return response;
}
