"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AppleIcon,
  FormFieldWrapper,
  GoogleIcon,
} from "@quarry/shared-components";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const signInSchema = z.object({
  email: z.string().min(1, "Введите email").email("Некорректный формат email"),
  password: z.string().min(1, "Введите пароль").min(8, "Минимум 8 символов"),
});

export type SignInValues = z.infer<typeof signInSchema>;

function QuarryLogo() {
  return (
    <div className="relative group flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
      <span className="flex shrink-0 overflow-hidden rounded-full relative h-20 w-20 sm:h-24 sm:w-24 shadow-lg ring-4 ring-white/50 group-hover:shadow-xl transition-all duration-300">
        {/* TODO: Replace on SVG Icon or correct url */}
        <img
          className="aspect-square h-full w-full object-cover"
          alt="Quarry.ink logo"
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a262fd3289be5507a23e6f/a2d10b609_blue-white.png"
        />
      </span>
    </div>
  );
}

// ── Props ───────────────────────────────────────────────────
interface WelcomeFormProps {
  onSubmit?: (values: SignInValues) => void | Promise<void>;
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
}

export function WelcomeForm({
  onSubmit,
  onGoogleClick,
  onAppleClick,
}: WelcomeFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: SignInValues) {
    try {
      setIsLoading(true);
      await onSubmit?.(values);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-[420px] rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/40">
        {/* ── Header ─────────────────────────────── */}
        <div className="mb-8 text-center">
          <QuarryLogo />
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Welcome to Quarry.ink
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">Sign in to continue</p>
        </div>

        {/* ── Social buttons ─────────────────────── */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="relative w-full h-11 rounded-xl border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={onGoogleClick}
          >
            <GoogleIcon className="absolute left-4 h-5 w-5" />
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="relative w-full h-11 rounded-xl border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={onAppleClick}
          >
            <AppleIcon className="absolute left-4 h-5 w-5" />
            Continue with Apple
          </Button>
        </div>

        {/* ── Divider ────────────────────────────── */}
        <div className="relative my-6">
          <Separator className="bg-slate-200" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-medium uppercase tracking-wider text-slate-300">
            or
          </span>
        </div>

        {/* ── Email / Password form ──────────────── */}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Email"
                styles={{ label: "font-medium text-slate-700" }}
                error={fieldState.error?.message}
              >
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-xl border-slate-200 pl-10 text-sm placeholder:text-slate-300 focus-visible:ring-[#3b6cf5]/30 focus-visible:border-[#3b6cf5]"
                  />
                </div>
              </FormFieldWrapper>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Password"
                styles={{ label: "font-medium text-slate-700" }}
                error={fieldState.error?.message}
              >
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-xl border-slate-200 pl-10 pr-10 text-sm placeholder:text-slate-300 focus-visible:ring-[#3b6cf5]/30 focus-visible:border-[#3b6cf5]"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormFieldWrapper>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* ── Footer links ───────────────────────── */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link
            href="/account/reset-password"
            className="font-semibold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
          >
            Forgot password?
          </Link>
          <p className="text-slate-400">
            Need an account?{" "}
            <Link
              href="/account/sign-up"
              className="font-semibold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
