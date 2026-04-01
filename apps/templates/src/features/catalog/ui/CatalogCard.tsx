"use client";

import { Button } from "@shared/components/ui/button";
import {
  CATALOG_CATEGORY_LABELS,
  CURRENCY_SYMBOLS,
} from "@shared/constants/mappers";
import type { Catalog } from "@shared/types/api";
import { EyeOff, Package, Pencil, Trash2 } from "lucide-react";

interface CatalogCardProps {
  item: Catalog;
  onEdit: (item: Catalog) => void;
  onDelete: (item: Catalog) => void;
}

export function CatalogCard({ item, onEdit, onDelete }: CatalogCardProps) {
  const symbol =
    CURRENCY_SYMBOLS[item.currency as keyof typeof CURRENCY_SYMBOLS] ??
    item.currency;

  const categoryLabel =
    CATALOG_CATEGORY_LABELS[
      item.category as keyof typeof CATALOG_CATEGORY_LABELS
    ] ?? item.category;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package className="w-8 h-8" />
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {item.type === "DRAFT" && (
            <span className="inline-flex items-center text-[11px] font-medium text-amber-700 bg-amber-100/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
              Draft
            </span>
          )}
          {!item.is_active && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
              <EyeOff className="w-3 h-3" /> Hidden
            </span>
          )}
          {item.stock_quantity !== null &&
            item.stock_quantity !== undefined &&
            item.stock_quantity === 0 && (
              <span className="text-[11px] font-medium text-red-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
                Sold out
              </span>
            )}
        </div>

        {item.stock_quantity !== null &&
          item.stock_quantity !== undefined &&
          item.stock_quantity > 0 && (
            <span className="absolute top-2.5 right-2.5 text-[11px] font-medium text-violet-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
              {item.stock_quantity} left
            </span>
          )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          {item.category && (
            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {categoryLabel}
            </span>
          )}
          <span className="text-base font-bold text-gray-900 ml-auto">
            {symbol}
            {item.price}
          </span>
        </div>

        <p className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-1">
          {item.name}
        </p>

        {item.description ? (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
            {item.description}
          </p>
        ) : (
          <div className="mb-3" />
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full text-xs h-8 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
            onClick={() => onEdit(item)}
          >
            <Pencil className="w-3 h-3 mr-1.5" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-8 px-3 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
