"use client";

import { Button } from "@shared/components/ui/button";
import { type Currency, SizeUnit } from "@shared/constants/enums";
import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import type { Design } from "@shared/types/api";
import { Pencil, Trash2 } from "lucide-react";

interface DesignCardProps {
  item: Design;
  onEdit: (item: Design) => void;
  onDelete: (item: Design) => void;
}

export function DesignCard({ item, onEdit, onDelete }: DesignCardProps) {
  const placements = item.preferred_body_placement?.length
    ? item.preferred_body_placement.join(", ")
    : "";

  const truncatedPlacements =
    placements.length > 20 ? `${placements.substring(0, 20)}...` : placements;

  const sizeStr =
    item.size !== null
      ? `${item.size} ${item.size_unit === SizeUnit.INCH ? "In" : "Cm"}`
      : "—";

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center">
      {item.type === "DRAFT" && (
        <span className="absolute top-3 left-3 text-[11px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full z-10">
          Draft
        </span>
      )}
      <div className="w-40 h-48 rounded-[50%] overflow-hidden bg-gray-100 mb-4 shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name ?? ""}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No image
          </div>
        )}
      </div>

      <p className="font-bold text-gray-900 text-sm mb-2 text-center">
        {item.name}
      </p>

      <div className="w-full flex justify-between text-xs text-gray-500 mb-1 px-1">
        <div>
          <p>Size - {sizeStr}</p>
          <p>
            Price -{" "}
            {item.currency ? CURRENCY_SYMBOLS[item.currency as Currency] : "$"}{" "}
            {item.price ?? "—"}
          </p>
        </div>

        {truncatedPlacements && (
          <div className="text-right">
            <p>Preferred - {truncatedPlacements}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 w-full mt-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-full text-xs h-9"
          onClick={() => onEdit(item)}
        >
          <Pencil className="w-3 h-3 mr-1.5" />
          Edit
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-full text-xs h-9"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="w-3 h-3 mr-1.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}
