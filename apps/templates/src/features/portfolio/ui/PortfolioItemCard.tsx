"use client";

import { Button } from "@shared/components/ui/button";
import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import type { Portfolio } from "@shared/types/api";
import { Pencil, Trash2 } from "lucide-react";

import { TypeBadge } from "@/shared/components/TypeBadge";

function formatSizeUnit(unit: string | null | undefined): string {
  if (unit === "CM") return "cm";
  if (unit === "INCH") return "in";
  return unit?.toLowerCase() ?? "cm";
}

interface PortfolioItemCardProps {
  item: Portfolio;
  onEdit: (item: Portfolio) => void;
  onDelete: (item: Portfolio) => void;
}

export function PortfolioItemCard({
  item,
  onEdit,
  onDelete,
}: PortfolioItemCardProps) {
  const symbol = item.currency
    ? (CURRENCY_SYMBOLS[item.currency] ?? item.currency)
    : "€";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative aspect-square bg-gray-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
        <TypeBadge type={item.type} className="absolute top-2 left-2" />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-gray-500">
              {!!item.size
                ? `${item.size} ${formatSizeUnit(item.size_unit)}`
                : "—"}
            </p>
          </div>
          <p className="text-xs font-medium text-gray-700">
            {symbol} {item.price ?? 0}
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl text-xs font-medium h-8"
            onClick={() => onEdit(item)}
          >
            <Pencil className="w-3 h-3 mr-1" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl text-xs font-medium h-8"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="w-3 h-3 mr-1" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
