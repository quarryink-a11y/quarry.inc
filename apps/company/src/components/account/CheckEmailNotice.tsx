// STATUS: done
"use client";

import { ArrowLeft, Mail } from "lucide-react";

interface CheckEmailNoticeProps {
  email: string;
  onBackToSignIn?: () => void;
}

// ── Component ───────────────────────────────────────────────
export function CheckEmailNotice({
  email,
  onBackToSignIn,
}: CheckEmailNoticeProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-[420px] rounded-2xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/40">
        {/* ── Icon ───────────────────────────────── */}
        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Mail className="h-7 w-7 text-slate-700" strokeWidth={1.5} />
          </div>
        </div>

        {/* ── Header ─────────────────────────────── */}
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Check your email
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            We&apos;ve sent password reset instructions to
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{email}</p>
        </div>

        {/* ── Info box ───────────────────────────── */}
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50/60 px-5 py-4 text-center text-sm leading-relaxed text-green-700">
          Please check your email for the password reset link. It may take a few
          minutes to arrive.
        </div>

        {/* ── Back link ──────────────────────────── */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onBackToSignIn}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
