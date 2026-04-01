"use client";

import type { TenantData } from "@shared/lib/fetch-tenant";
import { createContext, type ReactNode, useContext } from "react";

export const TenantContext = createContext<TenantData | null>(null);

/**
 * Provides tenant data to all child components.
 * Receives pre-fetched data from server component — no client-side fetch.
 */
export function TenantDataProvider({
  data,
  children,
}: {
  data: TenantData;
  children: ReactNode;
}) {
  return (
    <TenantContext.Provider value={data}>{children}</TenantContext.Provider>
  );
}

/** Safe everywhere — returns null outside tenant-scoped routes */
export function useTenant(): TenantData | null {
  return useContext(TenantContext);
}

/** For components that REQUIRE tenant data (template sections) */
export function useRequiredTenant(): TenantData {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error(
      "useRequiredTenant must be used within <TenantDataProvider>",
    );
  }
  return ctx;
}
