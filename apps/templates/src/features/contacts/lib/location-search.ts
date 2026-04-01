export async function searchLocations(
  query: string,
  type: "country" | "city",
  country?: string,
): Promise<string[]> {
  const res = await fetch("/api/location-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, type, country }),
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { items: string[] };
  return data.items ?? [];
}
