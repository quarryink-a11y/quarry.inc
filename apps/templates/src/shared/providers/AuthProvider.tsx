"use client";

import { setAuthToken } from "@shared/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

export type AuthUser = {
  id: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  email_verified?: boolean;
};

type MeResponse = {
  user: AuthUser | null;
  accessToken: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setAuthenticatedUser: (user: AuthUser | null) => void;
};

const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    return { user: null, accessToken: null };
  }

  return (await res.json()) as MeResponse;
}

async function postLogout(): Promise<void> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: fetchMe,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const user = data?.user ?? null;
  const accessToken = data?.accessToken ?? null;

  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      setAuthToken(null);
      queryClient.clear();
      window.location.replace("/sign-in");
    },
  });

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
  }, [queryClient]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const setAuthenticatedUser = useCallback(
    (user: AuthUser | null) => {
      queryClient.setQueryData<MeResponse>(AUTH_ME_QUERY_KEY, (prev) => ({
        user,
        accessToken: prev?.accessToken ?? null,
      }));
    },
    [queryClient],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshUser,
      logout,
      setAuthenticatedUser,
    }),
    [user, isLoading, refreshUser, logout, setAuthenticatedUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
