import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface CountryEntry {
  country: string;
  cities: string[];
}

let cache: CountryEntry[] | null = null;
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

async function loadCountriesData(): Promise<CountryEntry[]> {
  const now = Date.now();
  if (cache && now - cacheLoadedAt < CACHE_TTL_MS) return cache;

  const res = await fetch("https://countriesnow.space/api/v0.1/countries", {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`countriesnow fetch failed: ${res.status}`);

  const json = (await res.json()) as { data: CountryEntry[] };
  cache = json.data;
  cacheLoadedAt = now;
  return cache;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      query: string;
      type: "country" | "city";
      country?: string;
    };
    const { query, type, country } = body;

    if (!query || query.trim().length < 1) {
      return NextResponse.json({ items: [] });
    }

    const data = await loadCountriesData();
    const q = query.toLowerCase();

    if (type === "country") {
      const items = data
        .map((c) => c.country)
        .filter((name) => name.toLowerCase().includes(q))
        .slice(0, 10);
      return NextResponse.json({ items });
    }

    // type === "city"
    let pool = data;
    if (country) {
      pool = data.filter(
        (c) => c.country.toLowerCase() === country.toLowerCase(),
      );
    }

    const items = pool
      .flatMap((c) => c.cities)
      .filter((city) => city.toLowerCase().includes(q))
      .slice(0, 10);

    return NextResponse.json({ items });
  } catch (err) {
    console.error("[location-search]", err);
    return NextResponse.json({ items: [] });
  }
}
