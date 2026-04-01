import { ChevronDown } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

interface CountryCode {
  code: string;
  flag: string;
  name: string;
  id: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "+1", flag: "🇺🇸", name: "US", id: "us" },
  { code: "+1", flag: "🇨🇦", name: "CA", id: "ca" },
  { code: "+44", flag: "🇬🇧", name: "UK", id: "uk" },
  { code: "+49", flag: "🇩🇪", name: "DE", id: "de" },
  { code: "+33", flag: "🇫🇷", name: "FR", id: "fr" },
  { code: "+39", flag: "🇮🇹", name: "IT", id: "it" },
  { code: "+34", flag: "🇪🇸", name: "ES", id: "es" },
  { code: "+380", flag: "🇺🇦", name: "UA", id: "ua" },
  { code: "+48", flag: "🇵🇱", name: "PL", id: "pl" },
  { code: "+43", flag: "🇦🇹", name: "AT", id: "at" },
  { code: "+420", flag: "🇨🇿", name: "CZ", id: "cz" },
  { code: "+81", flag: "🇯🇵", name: "JP", id: "jp" },
  { code: "+82", flag: "🇰🇷", name: "KR", id: "kr" },
  { code: "+61", flag: "🇦🇺", name: "AU", id: "au" },
  { code: "+971", flag: "🇦🇪", name: "AE", id: "ae" },
  { code: "+972", flag: "🇮🇱", name: "IL", id: "il" },
  { code: "+90", flag: "🇹🇷", name: "TR", id: "tr" },
];

interface PhoneInputProps {
  code?: string;
  countryId?: string;
  number?: string;
  onCodeChange?: (code: string, countryId: string) => void;
  onNumberChange?: (value: string) => void;
}

function PhoneInput({
  code,
  countryId,
  number,
  onCodeChange,
  onNumberChange,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentCountry =
    (countryId && COUNTRY_CODES.find((c) => c.id === countryId)) ||
    COUNTRY_CODES.find((c) => c.code === code) ||
    COUNTRY_CODES[0];

  return (
    <div className="flex gap-2">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm whitespace-nowrap"
        >
          <span>{currentCountry.code}</span>
          <span className="text-base">{currentCountry.flag}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {open && (
          <div className="absolute z-50 top-full left-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden w-48">
            <div className="max-h-60 overflow-y-auto py-1">
              {COUNTRY_CODES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onCodeChange?.(c.code, c.id);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2"
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="text-gray-700">{c.code}</span>
                  <span className="text-gray-400 text-xs">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <input
        type="tel"
        value={number}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onNumberChange?.(e.target.value)
        }
        placeholder="Enter phone number"
        className="flex-1 bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm outline-none focus:ring-1 focus:ring-blue-300"
      />
    </div>
  );
}

export { COUNTRY_CODES, PhoneInput };
export type { CountryCode, PhoneInputProps };
