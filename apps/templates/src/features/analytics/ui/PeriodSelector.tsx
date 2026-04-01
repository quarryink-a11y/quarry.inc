"use client";

const periods = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "All time", value: 0 },
];

interface PeriodSelectorProps {
  selected: number;
  onChange: (value: number) => void;
}

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-2">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            selected === p.value
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
