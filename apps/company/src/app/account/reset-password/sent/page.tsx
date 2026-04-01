"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";

import type { NewPasswordValues } from "@/components/account/NewPassword";
import { NewPasswordForm } from "@/components/account/NewPassword";

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token) {
    router.replace("/account");
    return null;
  }
  async function handleSubmit(data: NewPasswordValues) {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        newPassword: data.password,
      }),
    });

    if (!res.ok) {
      console.error("Password reset failed: ", await res.text());
      toast.error("Password reset failed. Please try again.");
      return;
    }

    toast.success("Password reset successful. Please log in.", {
      duration: 3000,
    });
    router.push("/account");
  }

  function handleBackToLogin() {
    router.push("/account");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <NewPasswordForm
        onSubmit={handleSubmit}
        onBackToLogin={handleBackToLogin}
      />
    </div>
  );
}
