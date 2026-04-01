"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { CheckEmailNotice } from "@/components/account/CheckEmailNotice";
import type { ResetPasswordValues } from "@/components/account/ResetPasswordForm";
import { ResetPasswordForm } from "@/components/account/ResetPasswordForm";

export default function Page() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (data: ResetPasswordValues) => {
    const res = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
      }),
    });

    if (!res.ok) {
      console.error("Password reset request failed");
      toast.error("Password reset request failed. Please try again.");
      return;
    }

    toast.success(
      "Password reset request successful. Please check your email.",
      {
        duration: 3000,
      },
    );

    setEmail(data.email);
  };

  const handleBackToSignIn = () => {
    router.back();
  };
  return (
    <>
      {!email ? (
        <ResetPasswordForm
          onSubmit={handleSubmit}
          onBackToSignIn={handleBackToSignIn}
        />
      ) : (
        <CheckEmailNotice email={email} onBackToSignIn={handleBackToSignIn} />
      )}
    </>
  );
}
