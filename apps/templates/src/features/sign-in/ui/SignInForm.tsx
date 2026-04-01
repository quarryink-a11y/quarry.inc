"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AppleIcon,
  FormFieldWrapper,
  GoogleIcon,
} from "@quarry/shared-components";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTenantHref } from "@/shared/hooks/use-tenant-href";
import { cn } from "@/shared/lib/utils";

import { formSchema, type SignInFormData } from "../model";

export interface SignInFormProps {
  styles?: {
    container?: string;
    group?: string;
  };
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
  isGoogleLoading?: boolean;
  isAppleLoading?: boolean;
}

export function SignInForm({
  styles,
  onGoogleClick,
  onAppleClick,
  isGoogleLoading,
  isAppleLoading,
}: SignInFormProps) {
  const searchParams = useSearchParams();
  const { href } = useTenantHref();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, reset } = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(data: SignInFormData) {
    try {
      await toast.promise(
        async () => {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        },
        {
          loading: "Signing in...",
          success: "Signed in successfully!",
          error: "Sign-in failed.",
        },
      );

      const callbackUrl = searchParams.get("callbackUrl");
      window.location.replace(callbackUrl ?? href("/admin"));
      reset();
    } catch (error) {
      console.error("Sign-in failed:", error);
      toast.error("Sign-in failed. Please try again.");
    }
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center",
        styles?.container,
      )}
    >
      <div className="flex w-full max-w-[378px] flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isGoogleLoading}
          className="h-[50px] w-full rounded-[20px] border border-white bg-white/30 text-[16px] font-normal text-white hover:bg-white/40 hover:text-white disabled:opacity-60"
          onClick={onGoogleClick}
        >
          <GoogleIcon />
          {isGoogleLoading ? "Signing in..." : "Continue with Google"}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isAppleLoading}
          className="h-[50px] w-full rounded-[20px] border border-white bg-white/30 text-[16px] font-normal text-white hover:bg-white/40 hover:text-white disabled:opacity-60"
          onClick={onAppleClick}
        >
          <AppleIcon />
          {isAppleLoading ? "Signing in..." : "Continue with Apple"}
        </Button>
      </div>

      <div className="relative my-6 w-full max-w-[378px]">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/30" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#2F4DF8] px-3 text-sm font-medium uppercase tracking-wider text-white/60">
            or
          </span>
        </div>
      </div>

      <form
        className="flex w-full items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={cn("flex w-full flex-col gap-5", styles?.group)}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Email"
                required
                styles={{
                  label: "font-medium text-white text-base lg:text-lg",
                }}
                error={fieldState.error?.message}
              >
                <Input
                  {...field}
                  type="email"
                  placeholder="example@mail.com"
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "h-[50px] rounded-[20px] bg-white/30 text-white placeholder:text-white/50",
                    "border-white focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white",
                    fieldState.invalid &&
                      "border-destructive focus-visible:border-destructive focus-visible:ring-destructive",
                  )}
                />
              </FormFieldWrapper>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Password"
                required
                styles={{
                  label: "font-medium text-white text-base lg:text-lg",
                }}
                error={fieldState.error?.message}
              >
                <div className="group flex w-full max-w-[375px]">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    aria-invalid={fieldState.invalid}
                    className={cn(
                      "h-[50px] flex-1 rounded-l-[20px] rounded-r-none bg-white/30 text-white placeholder:text-white/50",
                      "border border-r-0 border-white focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white",
                      fieldState.invalid &&
                        "border-destructive focus-visible:border-destructive focus-visible:ring-destructive",
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={cn(
                      "h-[50px] rounded-l-none rounded-r-[20px] border border-l-0 bg-white/30 pr-4.5 text-white shadow-none hover:bg-white/30 hover:text-white",
                      "border-white focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white",
                      "group-focus-within:border-white",
                      fieldState.invalid &&
                        "border-destructive focus-visible:border-destructive focus-visible:ring-destructive group-focus-within:border-destructive",
                    )}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </Button>
                </div>
              </FormFieldWrapper>
            )}
          />

          <Button
            className="h-[50px] w-full max-w-[378px] rounded-[20px] border border-white bg-white text-[18px] leading-[158.7%] font-normal tracking-[-0.03em] text-[#1C1A1A]"
            size="lg"
            type="submit"
            variant="secondary"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
