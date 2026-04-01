"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const createAccountSchema = z
  .object({
    email: z.email("Invalid email address"),

    password: z
      .string()
      .min(1, "Enter your password")
      .min(8, "Minimum 8 characters")
      .refine((val) => /[a-z]/.test(val), {
        message: "At least 1 lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "At least 1 uppercase letter",
      })
      .refine((val) => /\d/.test(val), {
        message: "At least 1 number",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "At least 1 symbol",
      }),

    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof createAccountSchema>;

interface SignUpFormProps {
  onSubmit?: (values: SignUpFormValues) => void | Promise<void>;
  onBackToSignIn?: () => void;
}

export function SignUpForm({ onSubmit, onBackToSignIn }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(createAccountSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSubmit(values: SignUpFormValues) {
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
            Create your account
          </h1>
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
                    type="password"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-xl border-slate-200 pl-10 text-sm placeholder:text-slate-300 focus-visible:ring-[#3b6cf5]/30 focus-visible:border-[#3b6cf5]"
                  />
                </div>
              </FormFieldWrapper>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Confirm Password"
                styles={{ label: "font-medium text-slate-700" }}
                error={fieldState.error?.message}
              >
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...field}
                    type="password"
                    placeholder="Re-enter password"
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
            className="w-full h-11 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating…
              </span>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
