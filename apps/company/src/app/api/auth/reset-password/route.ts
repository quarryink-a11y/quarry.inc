import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";

export async function POST(req: NextRequest) {
  const { token, newPassword } = (await req.json()) as {
    token: string;
    newPassword: string;
  };

  const { data, error, response } = await apiClient.POST(
    "/api/auth/reset-password",
    { body: { token, newPassword } },
  );

  return NextResponse.json(response.ok ? data : error, {
    status: response.status,
  });
}
