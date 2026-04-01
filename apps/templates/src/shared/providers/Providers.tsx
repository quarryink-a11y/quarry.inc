"use client";

import { queryClient } from "@shared/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./AuthProvider";
import { TenantContext } from "./TenantProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantContext.Provider value={null}>{children}</TenantContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
