"use client";

import type { ReferralSource } from "@shared/constants/enums";
import {
  REFERRAL_SOURCE_COLORS,
  REFERRAL_SOURCE_LABELS,
} from "@shared/constants/mappers";
import type { ReferralSourceData } from "@shared/types/api";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ReferralSourcesChartProps {
  data: ReferralSourceData[];
}

export function ReferralSourcesChart({ data }: ReferralSourcesChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Referral Sources
        </h3>
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          No data for selected period
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => {
    const key = d.source.toUpperCase() as ReferralSource;
    return {
      ...d,
      _key: key,
      shortName: REFERRAL_SOURCE_LABELS[key] ?? d.source,
      fill: REFERRAL_SOURCE_COLORS[key] ?? "#9CA3AF",
    };
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-4">
        Referral Sources
      </h3>
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="shortName"
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                strokeWidth={2}
                stroke="#fff"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: 13,
                }}
                formatter={(value, name) => [
                  `${String(value)} (${total > 0 ? ((Number(value) / total) * 100).toFixed(0) : 0}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {chartData.map((d) => (
            <div key={d.source} className="flex items-center gap-2.5">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: REFERRAL_SOURCE_COLORS[d._key] ?? "#9CA3AF",
                }}
              />
              <span className="text-sm text-gray-600 flex-1 truncate">
                {d.shortName}
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {d.count}
              </span>
              <span className="text-xs text-gray-400 w-10 text-right">
                {d.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
