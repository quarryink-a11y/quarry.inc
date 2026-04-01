import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api-client";

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as {
    email: string;
    password: string;
  };

  const { data, error, response } = await apiClient.POST("/api/auth/signup", {
    body: { email, password },
  });

  return NextResponse.json(response.ok ? { email: data!.email } : error, {
    status: response.status,
  });
}
