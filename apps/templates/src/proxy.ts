import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Platform domains — requests from these hosts use slug-based resolution.
 * Custom domains (anything else) resolve by host directly.
 */
const PLATFORM_HOSTS = (
  process.env.PLATFORM_HOSTS ?? "quarry.ink,www.quarry.ink,localhost"
)
  .split(",")
  .map((h) => h.trim());

function isPlatformHost(hostname: string): boolean {
  return PLATFORM_HOSTS.some(
    (d) => hostname === d || hostname.endsWith(`.${d}`),
  );
}

/**
 * Top-level route segments that are NOT tenant slugs.
 * Must stay in sync with APP_ROUTES in use-tenant-href.ts.
 */
const APP_ROUTES = new Set([
  "admin",
  "sign-in",
  "preview",
  "_onboarding",
  "_templates",
  "_template-preview",
]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "localhost";
  const hostname = host.replace(/:\d+$/, "");
  const { pathname } = request.nextUrl;
  const isPlatform = isPlatformHost(hostname);

  console.warn(
    "[Proxy]",
    JSON.stringify({
      host,
      hostname,
      pathname,
      isPlatform,
      platformHosts: PLATFORM_HOSTS,
    }),
  );

  // ── Determine effective path & slug ─────────────────────────
  // For platform hosts: strip slug from path to get the real route
  // e.g. /ivan-tattoo/admin/portfolio → slug="ivan-tattoo", effectivePath="/admin/portfolio"
  let effectivePath = pathname;
  let slug: string | null = null;

  if (isPlatform) {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0] || null;

    if (!firstSegment) {
      // Root of platform domain with no slug — pass through (landing/404)
      return NextResponse.next();
    }

    if (!APP_ROUTES.has(firstSegment)) {
      slug = firstSegment;
      const rest = segments.slice(1).join("/");
      effectivePath = rest ? `/${rest}` : "/";
    }
    // If firstSegment is a known app route: slug stays null, effectivePath stays as pathname
  }

  console.warn("[Proxy] Resolved:", JSON.stringify({ slug, effectivePath }));

  // ── Admin auth guard (based on effective path) ──────────────
  if (
    effectivePath.startsWith("/admin") ||
    effectivePath.startsWith("/preview")
  ) {
    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      const signInPath = slug ? `/${slug}/sign-in` : "/sign-in";
      const loginUrl = new URL(signInPath, request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Tenant headers ──────────────────────────────────────────
  const requestHeaders = new Headers(request.headers);

  if (slug) {
    requestHeaders.set("x-tenant-host", slug);
    requestHeaders.set("x-resolution-type", "slug");

    // Rewrite: strip slug, forward to effective path
    // e.g. /ivan-tattoo/admin → /admin, /ivan-tattoo → /
    const url = request.nextUrl.clone();
    url.pathname = effectivePath;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  if (!isPlatform) {
    // Custom domain — resolve by host, no rewrite needed
    requestHeaders.set("x-tenant-host", hostname);
    requestHeaders.set("x-resolution-type", "custom_domain");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Platform host, known app route, no slug — no tenant context
  console.warn("[Proxy] No slug, passing through");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api (BFF route handlers)
     * - /_next (Next.js internals)
     * - /favicon.ico, static files
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico).*)",
  ],
};
