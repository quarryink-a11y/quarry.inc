"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { Lock } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Enter password")
      .min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type NewPasswordValues = z.infer<typeof newPasswordSchema>;

interface NewPasswordFormProps {
  onSubmit?: (values: NewPasswordValues) => void | Promise<void>;
  onBackToLogin?: () => void;
}

export function NewPasswordForm({
  onSubmit,
  onBackToLogin,
}: NewPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: NewPasswordValues) {
    try {
      setIsLoading(true);
      await onSubmit?.(values);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12 w-full">
      <div className="w-full max-w-[420px] rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/40">
        {/* ── Header ─────────────────────────────── */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Set new password
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Enter your new password for Quarry.ink
          </p>
        </div>

        {/* ── Form ───────────────────────────────── */}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="New Password"
                styles={{ label: "font-medium text-slate-700" }}
                error={fieldState.error?.message}
              >
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-xl border-slate-200 pl-10 text-sm placeholder:text-slate-300 focus-visible:ring-[#3b6cf5]/30 focus-visible:border-[#3b6cf5]"
                  />
                </div>
                {!fieldState.invalid && (
                  <p className="text-xs text-slate-400">
                    Must be at least 8 characters
                  </p>
                )}
              </FormFieldWrapper>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Confirm New Password"
                styles={{ label: "font-medium text-slate-700" }}
                error={fieldState.error?.message}
              >
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-xl border-slate-200 pl-10 text-sm placeholder:text-slate-300 focus-visible:ring-[#3b6cf5]/30 focus-visible:border-[#3b6cf5]"
                  />
                </div>
              </FormFieldWrapper>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-900/50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Resetting…
              </span>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>

        {/* ── Back link ──────────────────────────── */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
