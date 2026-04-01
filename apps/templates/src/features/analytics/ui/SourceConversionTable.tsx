"use client";

import type { ReferralSource } from "@shared/constants/enums";
import {
  REFERRAL_SOURCE_COLORS,
  REFERRAL_SOURCE_LABELS,
} from "@shared/constants/mappers";
import type { SourceConversionData } from "@shared/types/api";

interface SourceConversionTableProps {
  data: SourceConversionData[];
}

export function SourceConversionTable({ data }: SourceConversionTableProps) {
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalCompleted = data.reduce((s, d) => s + d.completed, 0);
  const totalInquiries = data.reduce((s, d) => s + d.total_inquiries, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Source Performance
        </h3>
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          No data for selected period
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-1">
        Source Performance
      </h3>
      <p className="text-xs text-gray-400 mb-5">
        Inquiry → Booking conversion & revenue by source
      </p>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{totalInquiries}</p>
          <p className="text-[11px] text-gray-400">Inquiries</p>
        </div>
        <div className="bg-green-50/60 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{totalCompleted}</p>
          <p className="text-[11px] text-gray-400">Booked</p>
        </div>
        <div className="bg-emerald-50/60 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-gray-900">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400">Revenue</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {data.map((d) => {
          const key = d.source as ReferralSource;
          const shortName = REFERRAL_SOURCE_LABELS[key] ?? d.source;
          const color = REFERRAL_SOURCE_COLORS[key] ?? "#9CA3AF";
          return (
            <div key={d.source} className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700 w-24 shrink-0 truncate">
                {shortName}
              </span>
              <div className="flex-1 flex items-center gap-1.5">
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-400 transition-all"
                    style={{ width: `${d.conversion_rate}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 w-10 text-right">
                  {d.conversion_rate.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-400 w-16 text-right">
                  {d.completed}/{d.total_inquiries}
                </span>
                <span className="text-sm font-semibold text-gray-800 w-20 text-right">
                  ${d.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
