"use client";

import { Button } from "@shared/components/ui/button";
import { format } from "date-fns";
import { MapPin, Pencil, Trash2 } from "lucide-react";

import type { EventItem } from "../model";

interface EventCardProps {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const dateStr = event.start_at
    ? `${format(new Date(event.start_at), "dd MMM yyyy")}${
        event.end_at
          ? ` – ${format(new Date(event.end_at), "dd MMM yyyy")}`
          : ""
      }`
    : "";

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {event.type === "DRAFT" && (
        <span className="absolute top-3 right-3 text-[11px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
          Draft
        </span>
      )}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3.5 h-3.5 text-gray-700 shrink-0" />
            <span className="font-bold text-gray-900 text-sm">
              {event.city}
              {event.country ? `, ${event.country}` : ""}
            </span>
          </div>

          {dateStr && <p className="text-sm text-gray-500 mb-0.5">{dateStr}</p>}

          <p className="text-sm text-gray-500 mb-4">{event.location}</p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs px-5"
              onClick={() => onEdit(event)}
            >
              <Pencil className="w-3 h-3 mr-1" />
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs px-5"
              onClick={() => onDelete(event)}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {event.image_url && (
          <div className="w-36 h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={event.image_url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
