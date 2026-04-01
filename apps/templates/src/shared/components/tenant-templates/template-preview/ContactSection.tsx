"use client";

import type { Event, PublicOwnerProfile } from "@shared/types/api";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";

import { BookingFormModal } from "./BookingFormModal";

interface ContactSectionProps {
  contact?: PublicOwnerProfile | null;
  ownerName?: string;
  events?: Event[];
}

export function ContactSection({
  contact,
  ownerName,
  events,
}: ContactSectionProps) {
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
  const studioImage = contact?.studio_photo_url ?? null;
  const email = contact?.email ?? null;
  const phone = contact?.phone ?? null;
  const copyright = ownerName ?? "";

  const locations = contact?.city
    ? [`${contact.city}${contact.country ? `, ${contact.country}` : ""}`]
    : [];
  const footerMapsUrl = googleMapsUrl;

  const sm = contact?.social_media;
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
      <section id="contact" className="bg-[#050505]">
        <div className="px-6 md:px-16 pt-28 md:pt-40 pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
            >
              <p className="label-caps text-white/35 mb-2">Current location</p>
              <p className="text-[13px] tracking-[0.12em] uppercase text-white/70 font-light">
                {locationCity}
                {studioName && (
                  <>
                    {" — "}
                    {googleMapsUrl ? (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 decoration-white/20 hover:text-white hover:decoration-white/50 transition-colors"
                      >
                        {studioName}
                      </a>
                    ) : (
                      studioName
                    )}
                  </>
                )}
              </p>
            </motion.div>
          </div>
        </div>

        {studioImage && (
          <div className="px-6 md:px-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.4 }}
              viewport={{ once: true }}
              className="group relative max-w-5xl mx-auto overflow-hidden"
              style={{ height: "620px" }}
            >
              <img
                src={studioImage}
                alt="Studio"
                style={{ transition: "filter 3s ease-out" }}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 pointer-events-none" />
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                onClick={() => setFormOpen(true)}
                className="absolute bottom-10 right-8 md:right-16 px-10 py-3.5 label-caps text-black bg-white hover:bg-white hover:scale-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 active:scale-100"
              >
                Book now
              </motion.button>
            </motion.div>
          </div>
        )}

        <div className="px-6 md:px-16 py-16 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <p className="label-caps text-white/20 mb-5">Navigate</p>
              {["About", "Portfolio", "Events", "FAQ"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-[12px] font-light text-white/35 hover:text-white/70 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="space-y-4">
              <p className="label-caps text-white/20 mb-5">Contact</p>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="block text-[12px] font-light text-white/35 hover:text-white/70 transition-colors"
                >
                  {email}
                </a>
              )}
              {phone && (
                <p className="text-[12px] font-light text-white/35">{phone}</p>
              )}
            </div>
            <div className="space-y-4">
              <p className="label-caps text-white/20 mb-5">Location</p>
              {locations.map((l, i) => (
                <p key={i} className="text-[12px] font-light text-white/35">
                  {l}
                </p>
              ))}
              {contact?.studio_address && (
                <p className="text-[12px] font-light text-white/35">
                  {contact.studio_address}
                </p>
              )}
              {footerMapsUrl && (
                <a
                  href={footerMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-[11px] tracking-[0.1em] uppercase text-white/50 border border-white/25 hover:border-white/50 hover:text-white/80 px-4 py-2 transition-all duration-300"
                >
                  Google Maps <span className="text-[10px]">↗</span>
                </a>
              )}
            </div>
            <div className="space-y-4">
              <p className="label-caps text-white/20 mb-5">Social</p>
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[12px] font-light text-white/35 hover:text-white/70 transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
          <div className="max-w-5xl mx-auto mt-14 pt-6 border-t border-white/[0.06] flex items-center justify-between">
            <p className="label-caps text-white/15">
              © {new Date().getFullYear()} {copyright}
            </p>
            <p className="label-caps text-white/10">Powered by quarry.ink</p>
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
