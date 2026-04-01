"use client";

import { Button } from "@shared/components/ui/button";
import type { BookingStep } from "@shared/types/api";
import { Pencil, Trash2 } from "lucide-react";

interface BookingStepCardProps {
  step: BookingStep;
  displayNumber?: number;
  onEdit: (step: BookingStep) => void;
  onDelete: (step: BookingStep) => void;
}

export function BookingStepCard({
  step,
  displayNumber,
  onEdit,
  onDelete,
}: BookingStepCardProps) {
  const number = displayNumber ?? step.sort_order;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-sm transition-shadow group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
            {number}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm">
              {step.title}
            </h3>

            {step.description && (
              <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap line-clamp-3">
                {step.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-blue-500"
            onClick={() => onEdit(step)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
            onClick={() => onDelete(step)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
