import { NextResponse } from "next/server";

interface CountryInfoEntry {
  name: string;
  dialCode: string;
  unicodeFlag: string;
  iso2: string;
}

let cache: CountryInfoEntry[] | null = null;
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

async function loadPhoneCodesData(): Promise<CountryInfoEntry[]> {
  const now = Date.now();
  if (cache && now - cacheLoadedAt < CACHE_TTL_MS) return cache;

  const res = await fetch(
    "https://countriesnow.space/api/v0.1/countries/info?returns=dialCode,unicodeFlag,flag",
    { next: { revalidate: 86400 } },
  );
  if (!res.ok) throw new Error(`countriesnow fetch failed: ${res.status}`);

  const json = (await res.json()) as { data: CountryInfoEntry[] };
  cache = json.data.filter((c) => c.dialCode && c.unicodeFlag);
  cacheLoadedAt = now;
  return cache;
}

export async function GET() {
  try {
    const data = await loadPhoneCodesData();
    const items = data.map((c) => ({
      code: c.dialCode.startsWith("+") ? c.dialCode : `+${c.dialCode}`,
      flag: c.unicodeFlag,
      name: c.iso2?.toUpperCase() ?? "",
      id: c.iso2?.toLowerCase() ?? c.name.toLowerCase().replace(/\s+/g, "-"),
      fullName: c.name,
    }));
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[phone-codes]", err);
    return NextResponse.json({ items: [] });
  }
}
