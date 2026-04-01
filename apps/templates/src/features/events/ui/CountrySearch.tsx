"use client";

import { ChevronDown, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CountrySearchProps {
  value: string;
  onChange: (city: string) => void;
}

interface NominatimResult {
  address?: Record<string, string>;
  display_name: string;
}

export function CountrySearch({ value, onChange }: CountrySearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchNominatim = async (query: string) => {
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&accept-language=en`;
      const res = await fetch(url);
      const data = (await res.json()) as NominatimResult[];
      const cities = data.map((item) => {
        const addr = item.address || {};
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.state ||
          item.display_name.split(",")[0];
        const country = addr.country ?? "";
        return country ? `${city}, ${country}` : city;
      });
      setResults([...new Set(cities)]);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (!search || search.length < 2) {
        setResults([]);
        return;
      }
      void searchNominatim(search);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search]);

  const handleSelect = (city: string) => {
    onChange(city);
    setOpen(false);
    setSearch("");
    setResults([]);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || "Type or select"}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search.trim()) {
                    handleSelect(search.trim());
                  }
                }}
                placeholder="Search city..."
                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                autoFocus
              />
              {loading ? (
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {results.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleSelect(c)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              >
                {c}
              </button>
            ))}
            {!loading && search.length >= 2 && results.length === 0 && (
              <button
                type="button"
                onClick={() => handleSelect(search.trim())}
                className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-blue-50"
              >
                Use &quot;{search.trim()}&quot;
              </button>
            )}
            {!loading && search.length < 2 && (
              <p className="px-4 py-3 text-sm text-gray-400">
                Start typing to search cities...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
