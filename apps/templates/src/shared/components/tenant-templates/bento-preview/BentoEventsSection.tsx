"use client";

import {
  EVENT_STATUS_DISPLAY_LABELS,
  EVENT_STATUS_STYLES,
} from "@shared/constants/mappers";
import type { Event } from "@shared/types/api";
import type { PublicOwnerProfile } from "@shared/types/api";
import type { EventStatusStyle } from "@shared/types/local-types";
import { formatDateRange, isBookableStatus } from "@shared/utils/event-helpers";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";

import { BookingFormModal } from "../template-preview/BookingFormModal";

const FONT = "'Manrope', sans-serif";

type EventStatus = Event["status"];

interface DisplayEvent {
  dates: string;
  city: string;
  studio: string;
  statusLabel: string;
  status: EventStatus;
  image: string;
}

interface BentoEventsSectionProps {
  events?: Event[];
  contact?: PublicOwnerProfile;
}

export function BentoEventsSection({
  events: eventsProp,
  contact,
}: BentoEventsSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [formCity, setFormCity] = useState("");

  if (!eventsProp?.length) return null;

  const events: DisplayEvent[] = eventsProp.map((e) => ({
    dates: formatDateRange(e.start_at, e.end_at),
    city: e.city,
    studio: e.location ?? "",
    statusLabel: EVENT_STATUS_DISPLAY_LABELS[e.status],
    status: e.status,
    image: e.image_url ?? "",
  }));

  const handleBook = (event: DisplayEvent) => {
    if (!isBookableStatus(event.status)) return;
    const cityLabel = [event.city, event.studio].filter(Boolean).join(", ");
    setFormCity(cityLabel);
    setFormOpen(true);
  };

  const leftEvent = events[0];
  const rightEvents = events.slice(1, 3);

  const renderStatusBadge = (event: DisplayEvent, style: EventStatusStyle) => {
    const bookable = isBookableStatus(event.status);
    return (
      <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap border border-white/10">
        {bookable && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
          />
        )}
        <span
          className={`text-[10px] tracking-[0.08em] uppercase font-medium ${style.text}`}
        >
          {event.statusLabel}
        </span>
        {bookable && (
          <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center ml-0.5">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        )}
      </div>
    );
  };

  const renderTallCard = (event: DisplayEvent, i: number) => {
    const style = EVENT_STATUS_STYLES[event.status];
    const bookable = isBookableStatus(event.status);
    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.08 }}
        viewport={{ once: true }}
        className={`rounded-[18px] overflow-hidden bg-[#141414] group flex flex-col h-full ${bookable ? "cursor-pointer" : ""}`}
        onClick={() => handleBook(event)}
      >
        <div className="p-4 pb-2">
          <h4 className="text-[18px] md:text-[22px] font-semibold text-white/90 uppercase tracking-wide mb-1">
            {event.city}
          </h4>
          <p className="text-[11px] text-[#D0FD0A]/70 font-medium mb-0.5">
            {event.dates}
          </p>
          <p className="text-[12px] text-white/30 font-extralight">
            {event.studio}
          </p>
        </div>
        {event.image && (
          <div className="mx-3 mb-3 overflow-hidden rounded-[12px] relative flex-1 min-h-[200px]">
            <img
              src={event.image}
              alt={event.city}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              {renderStatusBadge(event, style)}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderHorizontalCard = (event: DisplayEvent, i: number) => {
    const style = EVENT_STATUS_STYLES[event.status];
    const bookable = isBookableStatus(event.status);
    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.08 }}
        viewport={{ once: true }}
        className={`rounded-[18px] overflow-hidden bg-[#141414] group flex flex-col md:flex-row flex-1 ${bookable ? "cursor-pointer" : ""}`}
        onClick={() => handleBook(event)}
      >
        <div className="p-5 pb-2 md:pb-5 flex-shrink-0 md:flex md:flex-col md:justify-center md:w-[50%]">
          <h4 className="text-[20px] md:text-[24px] font-semibold text-white/90 uppercase tracking-wide mb-1.5">
            {event.city}
          </h4>
          <p className="text-[12px] text-[#D0FD0A]/70 font-medium mb-0.5">
            {event.dates}
          </p>
          <p className="text-[13px] text-white/30 font-extralight">
            {event.studio}
          </p>
        </div>
        {event.image && (
          <div className="mx-3 mb-3 md:ml-0 md:my-3 md:mr-3 overflow-hidden rounded-[12px] relative h-[100px] md:h-auto md:w-[45%]">
            <img
              src={event.image}
              alt={event.city}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              {renderStatusBadge(event, style)}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <Fragment>
      <section
        id="events"
        className="bg-black py-6 px-4 md:px-8"
        style={{ fontFamily: FONT }}
      >
        <div className="max-w-6xl mx-auto">
          <span className="inline-flex items-center text-[10px] tracking-[0.15em] uppercase text-black bg-[#D0FD0A] px-3 py-1.5 rounded-full mb-4 font-medium">
            Events
          </span>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-3">
            {leftEvent && renderTallCard(leftEvent, 0)}
            <div className="flex flex-col gap-3 h-full">
              {rightEvents.map((event, i) =>
                renderHorizontalCard(event, i + 1),
              )}
            </div>
          </div>
        </div>
      </section>
      <BookingFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        prefillCity={formCity}
        contact={contact}
        events={eventsProp}
      />
    </Fragment>
  );
}
