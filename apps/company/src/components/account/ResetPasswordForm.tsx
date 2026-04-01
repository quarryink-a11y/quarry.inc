"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const resetPasswordSchema = z.object({
  email: z.email("Некорректный формат email"),
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSubmit?: (values: ResetPasswordValues) => void | Promise<void>;
  onBackToSignIn?: () => void;
}

export function ResetPasswordForm({
  onSubmit,
  onBackToSignIn,
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSubmit(values: ResetPasswordValues) {
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
        {/* ── Back link ──────────────────────────── */}
        <button
          type="button"
          onClick={onBackToSignIn}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </button>

        {/* ── Header ─────────────────────────────── */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Reset your password
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Enter your email and we&apos;ll send you a link to reset your
            password
          </p>
        </div>

        {/* ── Form ───────────────────────────────── */}
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending…
              </span>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
