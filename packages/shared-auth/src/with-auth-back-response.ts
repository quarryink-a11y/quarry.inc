import { cookies } from "next/headers";

// Minimal shape — structurally compatible with generated ApiErrorResponseDto
type ApiErrorShape = {
  success: boolean;
  error: {
    code: string;
    message: string;
  };
};

type ResponseLike = {
  ok: boolean;
  status: number;
};

type BackendRequestResult<T> = {
  response: ResponseLike;
  data?: T;
  error?: ApiErrorShape;
};

type AuthenticatedRequestResult<T> =
  | {
      ok: true;
      backend: {
        status: number;
        data: T;
      };
      refreshedTokens?: {
        accessToken: string;
        refreshToken: string;
      };
    }
  | {
      ok: false;
      backend: {
        status: number;
        error: ApiErrorShape;
      };
      shouldClearCookies: boolean;
    };

export type RefreshResult = {
  response: ResponseLike;
  data?: { accessToken?: string; refreshToken?: string };
  error?: ApiErrorShape;
};

const unauthorizedError: ApiErrorShape = {
  success: false,
  error: { code: "UNAUTHORIZED", message: "Unauthorized" },
};

const internalError: ApiErrorShape = {
  success: false,
  error: { code: "INTERNAL_ERROR", message: "Internal error" },
};

/**
 * Creates a withAuthenticatedBackendRequest helper bound to the app's apiClient.
 *
 * Usage in each app:
 *   export const withAuthenticatedBackendRequest = createAuthHelper(
 *     (refreshToken) => apiClient.POST("/api/auth/refresh", { body: { refreshToken } })
 *   );
 */
export function createAuthHelper(
  refreshFn: (refreshToken: string) => Promise<RefreshResult>,
) {
  return async function withAuthenticatedBackendRequest<T>(
    request: (accessToken: string) => Promise<BackendRequestResult<T>>,
  ): Promise<AuthenticatedRequestResult<T>> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      return {
        ok: false,
        backend: { status: 401, error: unauthorizedError },
        shouldClearCookies: false,
      };
    }

    if (accessToken) {
      const backendRes = await request(accessToken);

      if (backendRes.response.ok && backendRes.data) {
        return {
          ok: true,
          backend: {
            status: backendRes.response.status,
            data: backendRes.data,
          },
        };
      }

      if (backendRes.response.status !== 401) {
        return {
          ok: false,
          backend: {
            status: backendRes.response.status,
            error: backendRes.error ?? internalError,
          },
          shouldClearCookies: false,
        };
      }
    }

    if (!refreshToken) {
      return {
        ok: false,
        backend: { status: 401, error: unauthorizedError },
        shouldClearCookies: true,
      };
    }

    const refreshRes = await refreshFn(refreshToken);

    if (
      !refreshRes.response.ok ||
      !refreshRes.data?.accessToken ||
      !refreshRes.data?.refreshToken
    ) {
      return {
        ok: false,
        backend: {
          status: refreshRes.response.status || 401,
          error: refreshRes.error ?? unauthorizedError,
        },
        shouldClearCookies: true,
      };
    }

    const retryRes = await request(refreshRes.data.accessToken);

    if (retryRes.response.ok && retryRes.data) {
      return {
        ok: true,
        backend: { status: retryRes.response.status, data: retryRes.data },
        refreshedTokens: {
          accessToken: refreshRes.data.accessToken,
          refreshToken: refreshRes.data.refreshToken,
        },
      };
    }

    return {
      ok: false,
      backend: {
        status: retryRes.response.status,
        error: retryRes.error ?? internalError,
      },
      shouldClearCookies: retryRes.response.status === 401,
    };
  };
}
