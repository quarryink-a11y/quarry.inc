"use client";

import { useTenantHref } from "@shared/hooks/use-tenant-href";
import type { Event } from "@shared/types/api";
import { format } from "date-fns";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

interface EventsCardProps {
  events: Event[];
}

export function EventsCard({ events }: EventsCardProps) {
  const { href } = useTenantHref();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Events</h3>
        <Link
          href={href("/admin/events")}
          className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </Link>
      </div>
      <div className="space-y-3">
        {events.slice(0, 2).map((event, i) => (
          <div
            key={event.id || i}
            className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-semibold text-gray-800 text-sm">
                  {event.city || "Kyiw"}
                </span>
                <span className="text-xs text-gray-400">
                  {event.start_at
                    ? format(new Date(event.start_at), "dd/MM/yyyy")
                    : ""}
                </span>
              </div>
              <p className="text-gray-500 text-sm pl-5.5">
                {event.location || "6:19 Tattoo Studio"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={
                  event.image_url ||
                  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=100&h=100&fit=crop"
                }
                alt={event.location ?? undefined}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
