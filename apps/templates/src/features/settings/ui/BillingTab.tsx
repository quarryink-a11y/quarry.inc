"use client";

import { Button } from "@shared/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  XCircle,
} from "lucide-react";

import { useBilling } from "../api/use-billing";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  ACTIVE: {
    label: "Active",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  TRIALING: { label: "Trial", color: "bg-blue-100 text-blue-700", icon: Clock },
  PAST_DUE: {
    label: "Past Due",
    color: "bg-amber-100 text-amber-700",
    icon: AlertCircle,
  },
  CANCELED: {
    label: "Canceled",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  PENDING: {
    label: "Pending",
    color: "bg-gray-100 text-gray-600",
    icon: Clock,
  },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BillingTab() {
  const { data, isLoading } = useBilling();
  const billing = data?.billing;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing</h2>
          <p className="text-sm text-gray-500">
            No billing information available yet.
          </p>
        </div>
      </div>
    );
  }

  const status = billing.billing_status
    ? (STATUS_CONFIG[billing.billing_status] ?? STATUS_CONFIG.PENDING)
    : STATUS_CONFIG.PENDING;
  const StatusIcon = status.icon;
  const planName = billing.plan_code === "PRO" ? "Pro" : "Basic";
  const isTrialing = billing.billing_status === "TRIALING";
  const isCanceled = billing.billing_status === "CANCELED";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing</h2>
        <p className="text-sm text-gray-500">
          Manage your subscription and payment details
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{planName} Plan</h3>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {isTrialing
                ? `Free trial until ${formatDate(billing.trial_ends_at)}`
                : isCanceled
                  ? `Canceled on ${formatDate(billing.canceled_at)}`
                  : `Next billing: ${formatDate(billing.current_period_end)}`}
            </p>
          </div>
          <StatusIcon
            className={`w-5 h-5 ${status.color.includes("green") ? "text-green-500" : status.color.includes("amber") ? "text-amber-500" : status.color.includes("red") ? "text-red-500" : "text-blue-500"}`}
          />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Portfolio up to 20 works</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Core modules (Events, FAQ, Reviews)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {billing.plan_code === "PRO" ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-gray-300" />
            )}
            <span
              className={billing.plan_code !== "PRO" ? "text-gray-400" : ""}
            >
              Custom domain {billing.plan_code !== "PRO" && "(Pro)"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {billing.plan_code === "PRO" ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-gray-300" />
            )}
            <span
              className={billing.plan_code !== "PRO" ? "text-gray-400" : ""}
            >
              Online shop {billing.plan_code !== "PRO" && "(Pro)"}
            </span>
          </div>
        </div>

        {billing.plan_code !== "PRO" && !isCanceled && (
          <Button className="bg-blue-500 hover:bg-blue-600" disabled>
            Upgrade to Pro — Coming soon
          </Button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Payment method</h3>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            Card on file (managed by Stripe)
          </span>
        </div>
      </div>
    </div>
  );
}
