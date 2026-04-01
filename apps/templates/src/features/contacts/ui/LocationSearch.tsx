"use client";

import { searchLocations } from "@features/contacts/lib/location-search";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchType: "country" | "city";
  country?: string;
}

export function LocationSearch({
  value,
  onChange,
  placeholder,
  searchType,
  country,
}: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!search || search.length < 1) return;
    timerRef.current = setTimeout(() => {
      void (async () => {
        setLoading(true);
        try {
          const items = await searchLocations(search, searchType, country);
          setResults(items);
        } catch {
          setResults([]);
        }
        setLoading(false);
      })();
    }, 250);
    return () => clearTimeout(timerRef.current);
  }, [search, country, searchType]);

  const displayedResults = search.length >= 1 ? results : [];
  const noResults =
    !loading && search.length >= 2 && displayedResults.length === 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm"
      >
        <span className={value ? "text-gray-900 truncate" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
                    onChange(search.trim());
                    setOpen(false);
                    setSearch("");
                  }
                }}
                placeholder={`Search ${searchType}...`}
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
            {displayedResults.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                  setSearch("");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              >
                {c}
              </button>
            ))}
            {noResults && (
              <button
                type="button"
                onClick={() => {
                  onChange(search.trim());
                  setOpen(false);
                  setSearch("");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-blue-50"
              >
                Use &ldquo;{search.trim()}&rdquo;
              </button>
            )}
            {!loading && search.length < 1 && (
              <p className="px-4 py-3 text-sm text-gray-400">Start typing...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
