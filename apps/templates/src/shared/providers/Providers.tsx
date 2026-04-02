"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { queryClient } from "@shared/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./AuthProvider";
import { TenantContext } from "./TenantProvider";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TenantContext.Provider value={null}>
            {children}
          </TenantContext.Provider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
