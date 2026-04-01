import { ChevronDown, Loader2, Search } from "lucide-react";
import type { ChangeEvent, KeyboardEvent } from "react";
import React, { useEffect, useRef, useState } from "react";

interface LocationSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchType?: "country" | "city";
  country?: string;
  fetchResults?: (
    query: string,
    searchType: string,
    country?: string,
  ) => Promise<string[]>;
}

export function LocationSearch({
  value,
  onChange,
  placeholder,
  searchType = "city",
  country,
  fetchResults,
}: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!search || search.length < 1) {
      setResults([]);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (!fetchResults) return;

      setLoading(true);
      try {
        const items = await fetchResults(search, searchType, country);
        const cleaned = items
          .map((item) =>
            typeof item === "string" ? item.trim() : String(item),
          )
          .filter(Boolean);
        setResults(cleaned);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search, country, searchType, fetchResults]);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
    setSearch("");
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      handleSelect(search.trim());
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm"
      >
        <span className={value ? "text-gray-900 truncate" : "text-gray-400"}>
          {value ?? placeholder}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                onKeyDown={handleInputKeyDown}
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

            {!loading && search.length < 1 && (
              <p className="px-4 py-3 text-sm text-gray-400">Start typing...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
