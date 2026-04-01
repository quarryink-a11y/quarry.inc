"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface CountryCode {
  code: string;
  flag: string;
  name: string;
  id: string;
  fullName: string;
}

// Fallback list shown before the API responds
const FALLBACK_CODES: CountryCode[] = [
  { code: "+1", flag: "🇺🇸", name: "US", id: "us", fullName: "United States" },
  { code: "+1", flag: "🇨🇦", name: "CA", id: "ca", fullName: "Canada" },
  { code: "+44", flag: "🇬🇧", name: "UK", id: "uk", fullName: "United Kingdom" },
  { code: "+49", flag: "🇩🇪", name: "DE", id: "de", fullName: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "FR", id: "fr", fullName: "France" },
  { code: "+380", flag: "🇺🇦", name: "UA", id: "ua", fullName: "Ukraine" },
  { code: "+48", flag: "🇵🇱", name: "PL", id: "pl", fullName: "Poland" },
  { code: "+7", flag: "🇷🇺", name: "RU", id: "ru", fullName: "Russia" },
  { code: "+34", flag: "🇪🇸", name: "ES", id: "es", fullName: "Spain" },
  { code: "+39", flag: "🇮🇹", name: "IT", id: "it", fullName: "Italy" },
];

// Module-level cache so it's shared across all instances
let codesCache: CountryCode[] | null = null;

export { FALLBACK_CODES as COUNTRY_CODES };

interface PhoneInputProps {
  code: string;
  countryId?: string;
  number: string;
  onCodeChange: (code: string, id: string) => void;
  onNumberChange: (number: string) => void;
}

export function PhoneInput({
  code,
  countryId,
  number,
  onCodeChange,
  onNumberChange,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [countryCodes, setCountryCodes] = useState<CountryCode[]>(
    () => codesCache ?? FALLBACK_CODES,
  );
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (codesCache) return;
    fetch("/api/phone-codes")
      .then((res) => res.json())
      .then((data: { items: CountryCode[] }) => {
        if (data.items?.length) {
          codesCache = data.items;
          setCountryCodes(data.items);
        }
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentCountry =
    (countryId ? countryCodes.find((c) => c.id === countryId) : undefined) ??
    countryCodes.find((c) => c.code === code) ??
    countryCodes[0];

  const filtered = search
    ? countryCodes.filter(
        (c) =>
          c.fullName.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search),
      )
    : countryCodes;

  const handleNumberChange = (val: string) => {
    onNumberChange(val.replace(/[^\d\s\-().]/g, ""));
  };

  return (
    <div className="flex gap-2">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => {
            if (!open) {
              setSearch("");
              setOpen(true);
              setTimeout(() => searchRef.current?.focus(), 0);
            } else {
              setOpen(false);
            }
          }}
          className="flex items-center gap-1.5 bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm whitespace-nowrap"
        >
          <span>{currentCountry?.code}</span>
          <span className="text-base">{currentCountry?.flag}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        {open && (
          <div className="absolute z-50 top-full left-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden w-56">
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-400">
                  No results found
                </p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onCodeChange(c.code, c.id);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2"
                  >
                    <span className="text-base">{c.flag}</span>
                    <span className="text-gray-700">{c.code}</span>
                    <span className="text-gray-400 text-xs truncate">
                      {c.fullName}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <input
        type="tel"
        value={number}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder="Enter phone number"
        className="flex-1 bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm outline-none focus:ring-1 focus:ring-blue-300"
      />
    </div>
  );
}
