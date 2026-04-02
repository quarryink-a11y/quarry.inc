// STATUS: done

"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import { CompletionStep } from "@/components/account/onboarding/CompletionStep";
import { useOnboarding } from "@/features/onboarding/context";

const platformBaseDomain = process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN;

export default function DonePage() {
  const { api } = useOnboarding();
  const launchedRef = useRef(false);

  const navigation = api.contextQuery.data?.navigation;
  const isAlreadyCompleted = navigation?.isCompleted === true;

  useEffect(() => {
    if (launchedRef.current || isAlreadyCompleted) return;
    launchedRef.current = true;

    api.launchSiteMutation.mutate();
  }, [api.launchSiteMutation, isAlreadyCompleted]);

  const isLaunching = api.launchSiteMutation.isPending && !isAlreadyCompleted;

  if (isLaunching) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  const siteDomain = api.contextQuery.data?.siteDomain;
  const profile = api.contextQuery.data?.profile;

  const hostname =
    siteDomain?.kind === "PLATFORM_SUBDOMAIN"
      ? `https://${platformBaseDomain}/${siteDomain.host}`
      : `https://${siteDomain?.host}`;

  return (
    <div className="flex items-center justify-center p-6">
      <CompletionStep
        href={`${hostname}/admin`}
        artistName={profile?.full_name}
      />
    </div>
  );
}
