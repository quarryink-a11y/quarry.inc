"use client";

import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import { useTenantHref } from "@shared/hooks/use-tenant-href";
import type { Portfolio } from "@shared/types/api";
import { Plus } from "lucide-react";
import Link from "next/link";

interface PortfolioCardProps {
  items: Portfolio[];
}

export function PortfolioCard({ items }: PortfolioCardProps) {
  const { href } = useTenantHref();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Portfolio</h3>
        <Link
          href={href("/admin/portfolio")}
          className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, 2).map((item, i) => (
          <div key={item.id || i}>
            <div className="aspect-4/5 rounded-xl overflow-hidden bg-gray-100 mb-2">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-0.5">
              <span>
                {item.size ? `${item.size} ${item.size_unit ?? "CM"}` : ""}
              </span>
              {item.price && (
                <span className="font-medium text-gray-700">
                  {item.currency ? CURRENCY_SYMBOLS[item.currency] : "€"}{" "}
                  {item.price}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
