"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useRef } from "react";
import { useEffect } from "react";

import type { SignInValues } from "@/components/account/WelcomeForm";
import { WelcomeForm } from "@/components/account/WelcomeForm";
import { useAuth } from "@/providers/AuthProvider";

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  prompt: () => void;
}

interface AppleIDAuth {
  init: (config: {
    clientId: string;
    scope: string;
    redirectURI: string;
    state: string;
    usePopup: boolean;
  }) => void;
  signIn: () => Promise<{
    authorization: { id_token: string; code: string };
    user?: { name?: { firstName?: string; lastName?: string } };
  }>;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
    AppleID?: { auth: AppleIDAuth };
  }
}

export default function Page() {
  const { setAuthenticatedUser, user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const googleInitialized = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace("/account/onboarding");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const initGoogle = () => {
    if (!window.google || googleInitialized.current) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: (response: { credential: string }) => {
        void (async () => {
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: response.credential,
            }),
          });

          if (!res.ok) {
            console.error("Google auth failed: ", await res.text());
            return;
          }

          const data = (await res.json()) as {
            user: { id: string; email: string; display_name?: string | null };
          };
          setAuthenticatedUser(data.user);
          window.location.replace("/account/onboarding");
        })();
      },
    });

    googleInitialized.current = true;
  };

  const handleSubmit = async (data: SignInValues) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Login failed");
      return;
    }
    const response = (await res.json()) as {
      user: { id: string; email: string; display_name?: string | null };
    };
    setAuthenticatedUser(response.user);
    window.location.replace("/account/onboarding");
  };

  const handleGoogleClick = () => {
    if (!window.google || !googleInitialized.current) {
      console.error("Google API not loaded");
      return;
    }

    window.google.accounts.id.prompt();
  };

  const handleAppleClick = () => {
    if (!window.AppleID) {
      console.error("Apple API not loaded");
      return;
    }

    void (async () => {
      try {
        const response = await window.AppleID!.auth.signIn();

        const res = await fetch("/api/auth/apple", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authorizationCode: response.authorization.code,
            idToken: response.authorization.id_token,
            firstName: response.user?.name?.firstName ?? null,
            lastName: response.user?.name?.lastName ?? null,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Apple auth failed");
          return;
        }

        const data = (await res.json()) as {
          user: { id: string; email: string; display_name?: string | null };
        };
        setAuthenticatedUser(data.user);
        window.location.replace("/account/onboarding");
      } catch (error) {
        console.error("Apple sign-in failed", error);
      }
    })();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isLoading && isAuthenticated && user) {
    return null;
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogle}
      />

      <Script
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.AppleID?.auth.init({
            clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
            scope: "name email",
            redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
            state: "apple-login",
            usePopup: true,
          });
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <WelcomeForm
          onSubmit={handleSubmit}
          onGoogleClick={handleGoogleClick}
          onAppleClick={handleAppleClick}
        />
      </div>
    </>
  );
}
