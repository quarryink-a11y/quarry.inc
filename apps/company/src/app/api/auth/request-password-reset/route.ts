import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email: string };

  const { data, error, response } = await apiClient.POST(
    "/api/auth/request-password-reset",
    { body: { email } },
  );

  return NextResponse.json(response.ok ? data : error, {
    status: response.status,
  });
}
