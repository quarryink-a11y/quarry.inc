"use client";

import type { LucideIcon } from "lucide-react";

type StatCardColor = "blue" | "green" | "purple" | "orange" | "pink";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  color?: StatCardColor;
}

const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", accent: "border-blue-100" },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    accent: "border-emerald-100",
  },
  purple: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    accent: "border-violet-100",
  },
  orange: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    accent: "border-amber-100",
  },
  pink: { bg: "bg-pink-50", text: "text-pink-600", accent: "border-pink-100" },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  color = "blue",
}: StatCardProps) {
  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border ${c.accent} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg} ${c.text}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>}
    </div>
  );
}
