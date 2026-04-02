import { apiClient, createAuthedClient } from "@shared/lib/api-client";
import { headers } from "next/headers";
import { cache } from "react";

export type ResolutionType = "slug" | "custom_domain";

export const fetchTenant = cache(async () => {
  const currentHeaders = await headers();
  const tenantHost = currentHeaders.get("x-tenant-host");
  const resolutionType = currentHeaders.get(
    "x-resolution-type",
  ) as ResolutionType | null;

  console.warn("[fetchTenant] tenantHost:", tenantHost, "resolutionType:", resolutionType);

  if (!tenantHost) return null;

  const { data, error } = await apiClient.GET("/api/public/site", {
    headers: { "x-tenant-host": tenantHost, "x-forwarded-host": tenantHost },
  });

  console.warn("[fetchTenant] result:", { hasData: !!data, error: error ?? null });

  if (!data || error) return null;

  return { ...data, resolutionType };
});

export type TenantData = NonNullable<Awaited<ReturnType<typeof fetchTenant>>>;

export const fetchTenantContent = cache(async () => {
  const currentHeaders = await headers();
  const tenantHost = currentHeaders.get("x-tenant-host");
  if (!tenantHost) return null;

  const { data, error } = await apiClient.GET("/api/public/site-content", {
    headers: { "x-tenant-host": tenantHost, "x-forwarded-host": tenantHost },
  });

  if (!data || error) return null;
  return data;
});

export const fetchTenantDraftContent = cache(async () => {
  const authedClient = await createAuthedClient();

  const { data, error } = await authedClient.GET("/api/sites/content", {
    params: { query: { type: "DRAFT" } },
  });

  if (!data || error) return null;
  return data;
});
