"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface VerifyEmailFormProps {
  email: string;
  onSubmit?: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
  onBackToSignIn?: () => void;
}

export function VerifyEmailForm({
  email,
  onSubmit,
  onResend,
  onBackToSignIn,
}: VerifyEmailFormProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleSubmit() {
    if (code.length !== 6) return;

    try {
      setIsLoading(true);
      await onSubmit?.(code);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    try {
      setIsResending(true);
      await onResend?.();
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-[420px] rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/40">
        {/* ── Back link ──────────────────────────── */}
        <button
          type="button"
          onClick={onBackToSignIn}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </button>

        {/* ── Icon ───────────────────────────────── */}
        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <ShieldCheck className="h-7 w-7 text-slate-700" strokeWidth={1.5} />
          </div>
        </div>

        {/* ── Header ─────────────────────────────── */}
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Verify your email
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            We&apos;ve sent a 6-digit code to
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{email}</p>
        </div>

        {/* ── OTP Input ──────────────────────────── */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={code}
            onChange={setCode}
            onComplete={handleSubmit}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-xs text-slate-400">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* ── Submit ─────────────────────────────── */}
        <div className="mt-6">
          <Button
            type="button"
            disabled={code.length !== 6 || isLoading}
            onClick={handleSubmit}
            className="w-full h-11 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying…
              </span>
            ) : (
              "Verify email"
            )}
          </Button>
        </div>

        {/* ── Resend ─────────────────────────────── */}
        <div className="mt-6 flex justify-center text-sm">
          <p className="text-slate-400">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-slate-900 hover:text-slate-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isResending ? "Sending…" : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
