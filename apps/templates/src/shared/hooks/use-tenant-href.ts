"use client";

import { usePathname } from "next/navigation";

/**
 * Known top-level route segments that are NOT slugs.
 * If pathname starts with one of these, there is no slug prefix.
 */
const APP_ROUTES = new Set([
  "admin",
  "sign-in",
  "api",
  "_next",
  "preview",
  "_onboarding",
  "_templates",
  "_template-preview",
]);

/**
 * Returns a function that generates tenant-aware absolute paths.
 *
 * Detects slug prefix from the current URL pathname:
 * - `/ivan-tattoo/admin/designs` → basePath = `/ivan-tattoo`
 * - `/admin/designs` → basePath = `` (custom domain, no slug)
 *
 * Works without TenantDataProvider — relies only on `usePathname()`.
 *
 * Usage:
 *   const { href } = useTenantHref();
 *   <Link href={href("/admin/designs")}>Designs</Link>
 *   router.push(href("/admin"));
 */
export function useTenantHref() {
  const pathname = usePathname();

  let basePath = "";

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (firstSegment && !APP_ROUTES.has(firstSegment)) {
    basePath = `/${firstSegment}`;
  }

  const href = (path: string) =>
    `${basePath}${path.startsWith("/") ? path : `/${path}`}`;

  return { href, basePath };
}
