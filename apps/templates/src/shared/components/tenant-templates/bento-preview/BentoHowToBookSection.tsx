"use client";

import type { BookingStep, Event } from "@shared/types/api";
import type { PublicOwnerProfile } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { BookingFormModal } from "../template-preview/BookingFormModal";

const FONT = "'Manrope', sans-serif";

interface DisplayStep {
  num: string;
  title: string;
  description?: string;
}

interface BentoHowToBookSectionProps {
  steps?: BookingStep[];
  contact?: PublicOwnerProfile;
  events?: Event[];
  profileImage?: string;
}

export function BentoHowToBookSection({
  steps,
  contact,
  events,
}: BentoHowToBookSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  if (!steps?.length) return null;

  const displaySteps: DisplayStep[] = steps.map((s, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: s.title,
    description: s.description ?? undefined,
  }));

  return (
    <section
      id="how-to-book"
      className="bg-black py-6 px-4 md:px-8"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-6xl mx-auto">
        <span className="inline-flex items-center text-[10px] tracking-[0.15em] uppercase text-black bg-[#D0FD0A] px-3 py-1.5 rounded-full mb-4 font-medium">
          How to book
        </span>

        {/* Desktop: horizontal accordion */}
        <div className="hidden md:flex gap-3" style={{ height: "520px" }}>
          {displaySteps.map((step, i) => {
            const isActive = activeIdx === i;
            const stepNum = step.num || String(i + 1).padStart(2, "0");

            return (
              <motion.div
                key={i}
                layout
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActiveIdx(i)}
                className={`bg-[#111111] border border-white/6 rounded-4xl cursor-pointer overflow-hidden relative flex flex-col ${
                  isActive ? "flex-3" : "flex-[0.42]"
                }`}
                style={{ minWidth: isActive ? undefined : "56px" }}
              >
                {isActive && (
                  <div className="flex flex-col h-full p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-7 h-7 rounded-full bg-[#D0FD0A] shrink-0" />
                      <span className="text-[18px] tracking-[0.04em] uppercase font-light text-white/90 flex-1">
                        {stepNum}. {step.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIdx(-1);
                        }}
                        className="text-[#D0FD0A] hover:text-white transition-colors"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[16px] leading-[1.75] text-white/50 font-extralight whitespace-pre-line flex-1 overflow-auto">
                      {step.description}
                    </p>
                    <div className="mt-4 relative rounded-[14px] overflow-hidden">
                      <div
                        className="w-full h-37.5"
                        style={{
                          background:
                            "radial-gradient(ellipse at 30% 50%, #1a1a1a 0%, #111 50%, #0a0a0a 100%)",
                        }}
                      >
                        <div
                          className="w-full h-full opacity-[0.04]"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            backgroundSize: "128px 128px",
                          }}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormOpen(true);
                        }}
                        className="absolute bottom-4 left-4 inline-flex items-center gap-3 bg-white/[0.1] backdrop-blur-md border border-white/[0.12] rounded-full pl-6 pr-2 py-2.5 hover:bg-white/[0.18] transition-all"
                      >
                        <span className="text-[13px] tracking-[0.06em] text-white/90 font-medium">
                          Book an appointment
                        </span>
                        <span className="w-8 h-8 rounded-full bg-[#D0FD0A] flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
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
                  </div>
                )}

                {!isActive && (
                  <div className="flex flex-col items-center h-full py-5">
                    <div className="w-5 h-5 rounded-full bg-[#D0FD0A] shrink-0 mb-4" />
                    <span
                      className="text-[10px] tracking-[0.14em] uppercase font-medium text-white/50"
                      style={{ writingMode: "vertical-lr" }}
                    >
                      {stepNum}. {step.title}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: vertical accordion cards */}
        <div className="md:hidden flex flex-col gap-2.5">
          {displaySteps.map((step, i) => {
            const stepNum = step.num || String(i + 1).padStart(2, "0");
            const isOpen = mobileActiveIdx === i;

            return (
              <motion.div
                key={i}
                layout
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setMobileActiveIdx(isOpen ? -1 : i)}
                className="bg-[#111111] border border-white/[0.06] rounded-[18px] cursor-pointer overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="w-6 h-6 rounded-full bg-[#D0FD0A] shrink-0" />
                  <span className="text-[13px] tracking-[0.06em] uppercase font-medium text-white/80 flex-1">
                    {stepNum}. {step.title}
                  </span>
                  <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </motion.svg>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5">
                        <p className="text-[14px] leading-[1.7] text-white/45 font-extralight whitespace-pre-line mb-4">
                          {step.description}
                        </p>

                        <div
                          className="rounded-[12px] overflow-hidden mb-4 h-[120px] relative"
                          style={{
                            background:
                              "radial-gradient(ellipse at 30% 50%, #1a1a1a 0%, #111 50%, #0a0a0a 100%)",
                          }}
                        >
                          <div
                            className="w-full h-full opacity-[0.04]"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                              backgroundSize: "128px 128px",
                            }}
                          />
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormOpen(true);
                          }}
                          className="inline-flex items-center gap-3 bg-white/[0.06] border border-white/[0.1] rounded-full pl-5 pr-1.5 py-2"
                        >
                          <span className="text-[11px] tracking-[0.06em] text-white/80 font-medium">
                            Book an appointment
                          </span>
                          <span className="w-7 h-7 rounded-full bg-[#D0FD0A] flex items-center justify-center">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <BookingFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          contact={contact}
          events={events}
        />
      </div>
    </section>
  );
}
