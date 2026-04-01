"use client";

import { apiClient } from "@shared/lib/api-client";
import { detectTrafficSource } from "@shared/utils/detect-traffic-source";
import { nanoid } from "nanoid";
import { useEffect } from "react";

import { useRequiredTenant } from "@/shared/providers/TenantProvider";

const DEDUP_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const VISITS_KEY = "quarry_visits";
const VISITOR_KEY = "quarry_visitor_id";

function sanitizedVisits(object: unknown): Record<string, number> {
  if (typeof object !== "object" || object === null) return {};
  const record: Record<string, number> = {};
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === "number") {
      record[key] = value;
    }
  }
  return record;
}
function shouldTrack(path: string): boolean {
  try {
    const raw = sessionStorage.getItem(VISITS_KEY);
    const visits: Record<string, number> = raw
      ? sanitizedVisits(JSON.parse(raw))
      : {};

    const lastVisit = visits[path];

    if (lastVisit && Date.now() - lastVisit < DEDUP_WINDOW_MS) {
      return false;
    }

    visits[path] = Date.now();
    sessionStorage.setItem(VISITS_KEY, JSON.stringify(visits));
    return true;
  } catch {
    return true;
  }
}

export function ClientWrapper() {
  const tenant = useRequiredTenant();
  const tenantHost = tenant.site_domain?.host ?? window.location.hostname;

  useEffect(() => {
    if (!tenant.settings?.analytics_enabled) return;

    const path = window.location.pathname;
    if (!shouldTrack(path)) return;

    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
      visitorId = nanoid();
      localStorage.setItem(VISITOR_KEY, visitorId);
    }

    const trafficSource = detectTrafficSource(
      document.referrer,
      new URLSearchParams(window.location.search),
    );

    void apiClient.POST("/api/public/track-visit", {
      body: {
        path,
        visitorKey: visitorId,
        referrer: document.referrer || undefined,
        trafficSource,
      },
      headers: {
        "x-forwarded-host": tenantHost,
      },
    });
  }, [tenant.settings?.analytics_enabled, tenantHost]);

  return null;
}
