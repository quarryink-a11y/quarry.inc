"use client";

import type { Event, PublicOwnerProfile } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { BookingFormModal } from "./BookingFormModal";

interface DisplayEvent {
  dates: string;
  city: string;
  studio: string;
  status: string;
  statusType: string;
  image: string;
}
type ApiEventStatus = "OPEN" | "CLOSED" | "WAITLIST" | "SOON";

/** Map API enum to human-readable status label */
const API_STATUS_LABEL_MAP: Record<ApiEventStatus, string> = {
  OPEN: "bookings open",
  CLOSED: "closed",
  WAITLIST: "waiting list",
  SOON: "soon",
};

/** Map API enum to display status type */
const API_STATUS_TYPE_MAP: Record<ApiEventStatus, string> = {
  OPEN: "open",
  CLOSED: "closed",
  WAITLIST: "open",
  SOON: "soon",
};

/** Format start_at / end_at into a date range string */
function formatDateRange(startAt: string, endAt?: string | null): string {
  const fmt = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  };
  if (!endAt) return fmt(startAt);
  return `${fmt(startAt)} – ${fmt(endAt)}`;
}

function HoverImage({
  src,
  city,
  visible,
}: {
  src: string;
  city: string;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-32 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:block shadow-2xl"
          style={{ width: "420px", height: "320px" }}
        >
          <img
            src={src}
            alt={city}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 border border-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface EventsSectionProps {
  events?: Event[];
  contact?: PublicOwnerProfile;
}

export function EventsSection({
  events: eventsProp,
  contact,
}: EventsSectionProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formCity, setFormCity] = useState("");

  if (!eventsProp?.length) return null;

  const events: DisplayEvent[] = eventsProp.map((e) => ({
    dates: formatDateRange(e.start_at, e.end_at),
    city: e.city,
    studio: e.location ?? "",
    status: API_STATUS_LABEL_MAP[e.status as ApiEventStatus] ?? e.status,
    statusType: API_STATUS_TYPE_MAP[e.status as ApiEventStatus] ?? "closed",
    image: e.image_url ?? "",
  }));

  const handleBook = (event: DisplayEvent) => {
    if (event.statusType !== "open") return;
    const cityLabel = [event.city, event.studio].filter(Boolean).join(", ");
    setFormCity(cityLabel);
    setFormOpen(true);
  };

  return (
    <>
      <section
        id="events"
        className="bg-[#050505] py-12 md:py-20 px-6 md:px-16"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="label-caps text-white/35"
            >
              Bookings / Events
            </motion.p>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              viewport={{ once: true }}
              className="label-caps text-white/20 mt-1"
            >
              {new Date().getFullYear()}
            </motion.span>
          </div>

          <div className="relative">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                viewport={{ once: true }}
                className="border-t border-white/[0.07] relative group"
              >
                <div className="py-8 md:py-10 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_1fr_auto] gap-4 md:gap-8 items-center">
                  <div>
                    <p className="text-[11px] tracking-[0.1em] uppercase text-white/20 font-light mb-2">
                      {event.dates}
                    </p>
                    <p className="text-[18px] md:text-[22px] font-light text-white/70 group-hover:text-white transition-colors duration-500 leading-none tracking-wide">
                      {event.city}
                    </p>
                  </div>
                  <div
                    className="hidden md:block cursor-pointer"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <p className="text-[11px] tracking-[0.1em] uppercase text-white/20 font-light mb-1.5">
                      Studio
                    </p>
                    <p className="text-[11px] tracking-[0.06em] text-white/35 hover:text-white/55 font-light transition-colors duration-500">
                      {event.studio}
                    </p>
                  </div>
                  <div className="text-right min-w-[120px]">
                    {event.statusType === "open" ? (
                      <button
                        onClick={() => handleBook(event)}
                        className="inline-flex items-center gap-2.5 ml-auto group/btn"
                      >
                        <motion.span
                          animate={{ opacity: [1, 0.25, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-white inline-block shrink-0"
                        />
                        <span className="text-[11px] tracking-[0.12em] uppercase text-white/70 group-hover/btn:text-white whitespace-nowrap transition-colors duration-300">
                          {event.status}
                        </span>
                      </button>
                    ) : (
                      <span className="text-[11px] tracking-[0.12em] uppercase text-white/20 whitespace-nowrap">
                        {event.status}
                      </span>
                    )}
                  </div>
                </div>
                {event.image && (
                  <HoverImage
                    src={event.image}
                    city={event.city}
                    visible={hovered === i}
                  />
                )}
              </motion.div>
            ))}
            <div className="border-t border-white/[0.07]" />
          </div>
        </div>
      </section>
      <BookingFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        prefillCity={formCity}
        contact={contact}
        events={eventsProp as never}
      />
    </>
  );
}
