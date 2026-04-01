import { createApiClient } from "@quarry/api-client";
import type { Middleware } from "openapi-fetch";
// ── Base (unauthenticated) client ────────────────────────────
export const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
);

// ── Auth middleware (client-side) ────────────────────────────
// Attaches the backend JWT to every request.
// Call `setAuthToken(token)` from useAuth() after session loads.

let _authToken: string | null = null;
let _isRefreshing = false;
let _refreshQueue: Array<(token: string | null) => void> = [];

export function setAuthToken(token: string | null) {
  _authToken = token;
}

async function refreshAccessToken(): Promise<string | null> {
  if (_isRefreshing) {
    return new Promise((resolve) => {
      _refreshQueue.push(resolve);
    });
  }

  _isRefreshing = true;

  try {
    const res = await fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      setAuthToken(null);
      _refreshQueue.forEach((cb) => cb(null));
      _refreshQueue = [];
      return null;
    }

    const data = (await res.json()) as { accessToken?: string };
    const newToken = data.accessToken ?? null;
    setAuthToken(newToken);
    _refreshQueue.forEach((cb) => cb(newToken));
    _refreshQueue = [];
    return newToken;
  } finally {
    _isRefreshing = false;
  }
}

const authMiddleware: Middleware = {
  onRequest({ request }) {
    if (_authToken) {
      request.headers.set("Authorization", `Bearer ${_authToken}`);
    }
    return request;
  },
  async onResponse({ request, response }) {
    if (response.status !== 401 || typeof window === "undefined") {
      return response;
    }

    const newToken = await refreshAccessToken();
    if (!newToken) return response;

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${newToken}`);
    return fetch(new Request(request, { headers }));
  },
};

apiClient.use(authMiddleware);

// ── Server-side authed client ────────────────────────────────
// Use in Server Components / Route Handlers where client-side
// hooks are not available. Reads the access_token cookie.

export async function createAuthedClient(): Promise<
  ReturnType<typeof createApiClient>
> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const client = createApiClient(
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  );

  if (token) {
    const serverAuthMiddleware: Middleware = {
      onRequest({ request }) {
        request.headers.set("Authorization", `Bearer ${token}`);
        return request;
      },
    };
    client.use(serverAuthMiddleware);
  }

  return client;
}
