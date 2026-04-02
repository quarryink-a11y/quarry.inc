"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

import type { SignInValues } from "@/components/account/WelcomeForm";
import { WelcomeForm } from "@/components/account/WelcomeForm";
import { useAuth } from "@/providers/AuthProvider";

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
    AppleID?: { auth: AppleIDAuth };
  }
}

export default function Page() {
  const { setAuthenticatedUser, user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const googleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace("/account/onboarding");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    if (!credentialResponse.credential) return;

    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: credentialResponse.credential }),
    });

    if (!res.ok) {
      console.error("Google auth failed:", await res.text());
      return;
    }

    const data = (await res.json()) as {
      user: { id: string; email: string; display_name?: string | null };
    };
    setAuthenticatedUser(data.user);
    window.location.replace("/account/onboarding");
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
    const btn =
      googleContainerRef.current?.querySelector<HTMLElement>(
        '[role="button"]',
      ) ??
      googleContainerRef.current?.querySelector<HTMLElement>("div[tabindex]");
    btn?.click();
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

      <div
        ref={googleContainerRef}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          height: 0,
          overflow: "hidden",
        }}
      >
        <GoogleLogin
          onSuccess={(resp) => void handleGoogleSuccess(resp)}
          onError={() => console.error("Google login failed")}
        />
      </div>

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
