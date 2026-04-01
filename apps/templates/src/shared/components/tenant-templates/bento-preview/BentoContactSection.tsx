"use client";

import type { Event, PublicOwnerProfile } from "@shared/types/api";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";

import { BookingFormModal } from "../template-preview/BookingFormModal";

const FONT = "'Manrope', sans-serif";

interface BentoContactSectionProps {
  contact?: PublicOwnerProfile | null;
  ownerName?: string;
  events?: Event[];
}

export function BentoContactSection({
  contact,
  ownerName,
  events,
}: BentoContactSectionProps) {
  const [formOpen, setFormOpen] = useState(false);

  const locationCity = contact
    ? `${contact.city ?? ""}${contact.country ? `, ${contact.country}` : ""}`.trim() ||
      null
    : null;
  const studioName = contact?.studio_name ?? null;
  const googleMapsQuery =
    [contact?.studio_name, contact?.studio_address, contact?.city]
      .filter(Boolean)
      .join(", ") || null;
  const googleMapsUrl = googleMapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsQuery)}`
    : null;

  const sm = contact?.social_media;
  const email = contact?.email ?? null;
  const telegram = sm?.TELEGRAM ?? null;
  const whatsapp = sm?.WHATSAPP ?? null;
  const phone = contact?.phone ?? null;
  const copyright = ownerName ?? "";

  const socials: { name: string; href: string }[] = contact
    ? ([
        sm?.INSTAGRAM ? { name: "Instagram", href: sm.INSTAGRAM } : null,
        sm?.FACEBOOK ? { name: "Facebook", href: sm.FACEBOOK } : null,
        sm?.TIKTOK ? { name: "TikTok", href: sm.TIKTOK } : null,
        sm?.TELEGRAM
          ? {
              name: "Telegram",
              href: sm.TELEGRAM.startsWith("http")
                ? sm.TELEGRAM
                : `https://t.me/${sm.TELEGRAM.replace("@", "")}`,
            }
          : null,
        sm?.WHATSAPP
          ? {
              name: "WhatsApp",
              href: `https://wa.me/${sm.WHATSAPP.replace(/\D/g, "")}`,
            }
          : null,
        sm?.YOUTUBE ? { name: "YouTube", href: sm.YOUTUBE } : null,
      ].filter(Boolean) as { name: string; href: string }[])
    : [];

  return (
    <Fragment>
      <section
        id="contact"
        className="bg-black pt-16 pb-0 px-4 md:px-8"
        style={{ fontFamily: FONT }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 md:gap-16 mb-10">
              <div className="flex flex-col justify-center">
                <div className="mb-8">
                  <span className="text-[11px] tracking-[0.18em] uppercase text-[#D0FD0A]/60 font-medium">
                    Current location:
                  </span>
                  <p className="text-[22px] md:text-[26px] font-normal text-white/90 mt-3 leading-snug">
                    {locationCity}
                    {studioName && (
                      <>
                        {" "}
                        (
                        {googleMapsUrl ? (
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D0FD0A]/80 hover:text-[#D0FD0A] transition-colors"
                          >
                            {studioName}
                          </a>
                        ) : (
                          studioName
                        )}
                        )
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-2 mb-8">
                  {email && (
                    <p className="text-[14px] font-extralight text-white/40">
                      Email:{" "}
                      <a
                        href={`mailto:${email}`}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        {email}
                      </a>
                    </p>
                  )}
                  {telegram && (
                    <p className="text-[14px] font-extralight text-white/40">
                      Telegram:{" "}
                      <span className="text-white/60">{telegram}</span>
                    </p>
                  )}
                  {whatsapp && (
                    <p className="text-[14px] font-extralight text-white/40">
                      WhatsApp:{" "}
                      <span className="text-white/60">{whatsapp}</span>
                    </p>
                  )}
                  {phone && (
                    <p className="text-[14px] font-extralight text-white/40">
                      Phone: <span className="text-white/60">{phone}</span>
                    </p>
                  )}
                </div>

                {socials.length > 0 && (
                  <div className="flex gap-3">
                    {socials.map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/[0.07] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/15 transition-all"
                        title={s.name}
                      >
                        {s.name === "Instagram" && (
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="5" />
                            <circle
                              cx="17.5"
                              cy="6.5"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                          </svg>
                        )}
                        {s.name === "Facebook" && (
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        )}
                        {s.name === "TikTok" && (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z" />
                          </svg>
                        )}
                        {!["Instagram", "Facebook", "TikTok"].includes(
                          s.name,
                        ) && (
                          <span className="text-[10px] font-medium uppercase">
                            {s.name.charAt(0)}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {googleMapsQuery && (
                <div className="rounded-[18px] overflow-hidden h-[300px] md:h-[340px] bg-[#1e1e1e]">
                  <iframe
                    title="Location map"
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      filter:
                        "invert(1) grayscale(1) brightness(0.55) contrast(1.1)",
                    }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(googleMapsQuery)}&zoom=12`}
                  />
                </div>
              )}
            </div>
          </motion.div>

          <div className="py-6">
            <div className="flex items-center justify-between overflow-x-auto">
              {["About", "Events", "How to book", "FAQ", "Portfolio"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-[11px] tracking-[0.08em] uppercase text-white/30 hover:text-white/60 whitespace-nowrap transition-colors font-medium"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>

          <div className="flex justify-center py-6">
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.1] rounded-full pl-5 pr-1.5 py-1.5 hover:bg-white/[0.14] transition-all group"
            >
              <span className="text-[10px] tracking-[0.1em] uppercase text-white/80 font-medium">
                Book an appointment
              </span>
              <span className="w-7 h-7 rounded-full bg-[#D0FD0A] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          <div className="border-t border-white/[0.06]" />

          <div className="pt-6 pb-8 overflow-hidden">
            <h2
              className="font-extrabold leading-[0.9] tracking-[-0.03em] uppercase text-center select-none break-words"
              style={{
                fontSize: "clamp(2rem, 10vw, 7vw)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {copyright}
            </h2>
          </div>
        </div>
      </section>
      <BookingFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        contact={contact ?? undefined}
        events={events}
      />
    </Fragment>
  );
}
