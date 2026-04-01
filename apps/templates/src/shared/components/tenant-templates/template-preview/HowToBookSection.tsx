"use client";

import type { BookingStep, Event, PublicOwnerProfile } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { BookingFormModal } from "./BookingFormModal";

interface DisplayStep {
  num: string;
  title: string;
  description?: string;
}

interface HowToBookSectionProps {
  steps?: BookingStep[];
  contact?: PublicOwnerProfile;
  events?: Event[];
}

export function HowToBookSection({
  steps,
  contact,
  events,
}: HowToBookSectionProps) {
  const [open, setOpen] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  if (!steps?.length) return null;

  const displaySteps: DisplayStep[] = steps.map((s, i) => ({
    num: String(s.sort_order ?? i + 1).padStart(2, "0"),
    title: s.title,
    description: s.description ?? undefined,
  }));

  return (
    <section
      id="how-to-book"
      className="bg-[#050505] py-12 md:py-20 px-6 md:px-16"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="label-caps text-white/35"
          >
            How to book
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            onClick={() => setFormOpen(true)}
            className="hidden lg:block label-caps text-white/35 border-white/35 hover:text-white/70 hover:border-white/70 border-b pb-1 transition-colors"
          >
            Book a consultation <span className="text-[9px] ml-0.5">↗</span>
          </motion.button>
        </div>

        <div className="w-full">
          {displaySteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              viewport={{ once: true }}
              className="border-t border-white/[0.07]"
            >
              <button
                className="w-full py-8 grid grid-cols-[48px_1fr_24px] md:grid-cols-[80px_1fr_24px] gap-6 items-center text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="label-caps text-white/20 group-hover:text-white/40 transition-colors">
                  {step.num || String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif-display text-[26px] md:text-[34px] font-light text-white/80 group-hover:text-white transition-colors leading-none tracking-tight">
                  {step.title}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/30 text-[22px] font-extralight self-center justify-self-end"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {open === i && step.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pl-[72px] md:pl-[104px] pb-8 text-[13px] leading-[2.1] text-white/40 font-light">
                      {step.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          onClick={() => setFormOpen(true)}
          className="lg:hidden mt-12 label-caps text-white/35 border-white/35 hover:text-white/70 hover:border-white/70 border-b pb-1 transition-colors"
        >
          Book a consultation <span className="text-[9px] ml-0.5">↗</span>
        </motion.button>

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
