"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import type { SignUpFormValues } from "@/components/account/SignUpForm";
import { SignUpForm } from "@/components/account/SignUpForm";

export default function Page() {
  const router = useRouter();

  const handleSubmit = async (data: SignUpFormValues) => {
    const res = await fetch("/api/auth/signup", {
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
      console.error("Sign up failed");
      toast.error("Sign up failed. Please try again.");
      return;
    }

    const response = (await res.json()) as { email: string };

    router.push(
      "/account/sign-up/verify-email?email=" +
        encodeURIComponent(response.email),
    );
  };

  const handleBackToSignIn = () => {
    router.back();
  };

  return (
    <SignUpForm onSubmit={handleSubmit} onBackToSignIn={handleBackToSignIn} />
  );
}
