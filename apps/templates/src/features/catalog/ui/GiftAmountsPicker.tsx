"use client";

import { Input } from "@shared/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const PRESET_AMOUNTS = [50, 100, 150, 200, 300, 500];

interface GiftAmountsPickerProps {
  value: number[];
  onChange: (amounts: number[]) => void;
}

export function GiftAmountsPicker({
  value = [],
  onChange,
}: GiftAmountsPickerProps) {
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customPresets, setCustomPresets] = useState<number[]>(() =>
    (value || []).filter((v) => !PRESET_AMOUNTS.includes(v)),
  );

  const toggle = (amount: number) => {
    if (value.includes(amount)) {
      onChange(value.filter((v) => v !== amount));
    } else {
      onChange([...value, amount].sort((a, b) => a - b));
    }
  };

  const addCustom = () => {
    const num = Number(customInput);
    if (
      num > 0 &&
      !PRESET_AMOUNTS.includes(num) &&
      !customPresets.includes(num)
    ) {
      setCustomPresets((prev) => [...prev, num].sort((a, b) => a - b));
    }
    setCustomInput("");
    setShowCustom(false);
  };

  const removeCustomPreset = (amount: number) => {
    setCustomPresets((prev) => prev.filter((v) => v !== amount));
    onChange(value.filter((v) => v !== amount));
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">Gift certificate amounts</p>
      <div className="flex flex-wrap gap-2">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => toggle(amount)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              value.includes(amount)
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          >
            ${amount}
          </button>
        ))}

        {customPresets.map((amount) => (
          <div key={`custom-${amount}`} className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => toggle(amount)}
              className={`px-3.5 py-1.5 rounded-l-lg text-sm font-medium border transition-all ${
                value.includes(amount)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              ${amount}
            </button>
            <button
              type="button"
              onClick={() => removeCustomPreset(amount)}
              className="px-1.5 py-1.5 rounded-r-lg text-sm border border-l-0 border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {showCustom ? (
          <div className="flex items-center gap-1.5">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Amount"
              value={customInput}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                setCustomInput(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  addCustom();
                }
              }}
              className="w-24 h-8 rounded-lg bg-white border-gray-200 text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={addCustom}
              className="text-blue-500 text-sm font-medium hover:text-blue-600"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCustom(false);
                setCustomInput("");
              }}
              className="text-gray-400 text-sm hover:text-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCustom(true)}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium border border-dashed border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-500 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Custom
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Select amounts clients can choose from. They can also enter a custom
        amount.
      </p>
    </div>
  );
}
