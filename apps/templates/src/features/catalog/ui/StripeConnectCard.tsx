"use client";

import { Button } from "@shared/components/ui/button";
import { stripeConnectKeys } from "@shared/hooks/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useConnectOnboard, useConnectStatus } from "../api/use-stripe-connect";

export function StripeConnectCard() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const { data: status, isLoading } = useConnectStatus();
  const connectOnboard = useConnectOnboard();

  useEffect(() => {
    if (searchParams.get("stripe") === "connected") {
      void queryClient.invalidateQueries({
        queryKey: stripeConnectKeys.status(),
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams, queryClient]);

  const handleConnect = () => {
    const currentUrl = window.location.href.split("?")[0];
    connectOnboard.mutate(currentUrl + "?stripe=connected", {
      onSuccess: (data) => {
        if (data?.url) {
          window.location.href = data.url;
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm flex items-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-400">Checking payment setup...</span>
      </div>
    );
  }

  const isActive = status?.connected && status?.charges_enabled;
  const isPending = status?.connected && !status?.charges_enabled;

  return (
    <div
      className={`rounded-2xl p-5 mb-6 shadow-sm border ${isActive ? "bg-green-50/50 border-green-200" : "bg-white border-gray-100"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-green-100" : "bg-blue-50"}`}
          >
            <CreditCard
              className={`w-5 h-5 ${isActive ? "text-green-600" : "text-blue-500"}`}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
              {isActive
                ? "Stripe Connected"
                : "Connect Stripe to accept payments"}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {isActive
                ? "Your account is active. Payments from catalog go directly to you."
                : isPending
                  ? "Your account setup is incomplete. Please finish onboarding."
                  : "Connect your Stripe account so clients can buy products from your catalog and you receive payments directly."}
            </p>
          </div>
        </div>

        {isActive ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-600">Active</span>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={connectOnboard.isPending}
            className="shrink-0 bg-blue-500 hover:bg-blue-600 rounded-full px-5 text-xs font-semibold"
          >
            {connectOnboard.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                {isPending ? "Continue Setup" : "Connect Stripe"}
                <ExternalLink className="w-3 h-3 ml-1.5" />
              </>
            )}
          </Button>
        )}
      </div>

      {isPending && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            Your Stripe account setup is not complete. Customers won&apos;t be
            able to buy until you finish.
          </span>
        </div>
      )}
    </div>
  );
}
