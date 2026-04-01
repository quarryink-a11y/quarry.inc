"use client";

import type { ClientInsightsData } from "@shared/types/api";
import { RefreshCw, UserCheck, UserPlus } from "lucide-react";

interface ClientInsightsProps {
  data: ClientInsightsData;
}

export function ClientInsights({ data }: ClientInsightsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-5">
        Client Insights
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-blue-50/60 rounded-xl p-3.5 text-center">
          <UserCheck className="w-4.5 h-4.5 text-blue-500 mx-auto mb-1.5" />
          <p className="text-xl font-bold text-gray-900">
            {data.total_clients}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Total</p>
        </div>
        <div className="bg-green-50/60 rounded-xl p-3.5 text-center">
          <UserPlus className="w-4.5 h-4.5 text-green-500 mx-auto mb-1.5" />
          <p className="text-xl font-bold text-gray-900">{data.new_clients}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">New</p>
        </div>
        <div className="bg-purple-50/60 rounded-xl p-3.5 text-center">
          <RefreshCw className="w-4.5 h-4.5 text-purple-500 mx-auto mb-1.5" />
          <p className="text-xl font-bold text-gray-900">
            {data.returning_clients}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Returning</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Return rate</span>
          <span className="text-sm font-bold text-gray-800">
            {data.return_rate}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div
            className="bg-purple-500 h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min(data.return_rate, 100)}%` }}
          />
        </div>
      </div>

      {data.top_returning.length > 0 ? (
        <div>
          <p className="text-xs text-gray-400 mb-2.5 uppercase tracking-wider">
            Top returning clients
          </p>
          <div className="space-y-2">
            {data.top_returning.map((c) => (
              <div
                key={c.email}
                className="flex items-center justify-between py-1.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {c.name || c.email}
                  </p>
                  {c.name && (
                    <p className="text-xs text-gray-400 truncate">{c.email}</p>
                  )}
                </div>
                <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-lg shrink-0 ml-2">
                  {c.inquiry_count} visits
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-3">
          No returning clients yet
        </p>
      )}
    </div>
  );
}
