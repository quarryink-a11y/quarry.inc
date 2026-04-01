"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";

import { VerifyEmailForm } from "@/components/account/VerifyEmailForm";
import { useAuth } from "@/providers/AuthProvider";

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const { setAuthenticatedUser } = useAuth();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const router = useRouter();

  async function handleSubmit(code: string) {
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code: code.trim(),
      }),
    });

    if (!res.ok) {
      console.error("Email verification failed: ", await res.text());
      toast.error("Email verification failed. Please try again.");
      return;
    }

    const data = (await res.json()) as {
      user: { id: string; email: string; display_name?: string | null };
    };
    setAuthenticatedUser(data.user);

    toast.success(
      "Email verification successful. Redirecting to onboarding...",
      {
        duration: 3000,
      },
    );

    router.push("/account/onboarding");
  }

  async function handleResend() {
    const res = await fetch("/api/auth/resend-verification-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (!res.ok) {
      console.error("Resend verification email failed: ", await res.text());
      toast.error("Failed to resend verification email. Please try again.");
      return;
    }

    toast.success(
      "Verification email resent successfully. Please check your inbox.",
      {
        duration: 3000,
      },
    );
  }
  return (
    <VerifyEmailForm
      email={email}
      onSubmit={handleSubmit}
      onResend={handleResend}
      onBackToSignIn={() => {
        router.push("/account");
      }}
    />
  );
}
