import type { TrafficSource } from "@quarry/api-types";

export function detectTrafficSource(
  referrer: string,
  searchParams: URLSearchParams,
): TrafficSource {
  const utmSource = searchParams.get("utm_source")?.toLowerCase();

  if (utmSource) {
    if (utmSource.includes("instagram")) return "INSTAGRAM";
    if (utmSource.includes("facebook") || utmSource.includes("fb"))
      return "FACEBOOK";
    if (utmSource.includes("google")) return "GOOGLE";
    return "OTHER";
  }

  if (!referrer) return "DIRECT";

  try {
    const hostname = new URL(referrer).hostname;
    if (hostname.includes("instagram")) return "INSTAGRAM";
    if (hostname.includes("facebook") || hostname.includes("fb.com"))
      return "FACEBOOK";
    if (hostname.includes("google")) return "GOOGLE";
    return "OTHER";
  } catch {
    return "OTHER";
  }
}
