"use client";

import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import type { Design } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface DisplaySketch {
  id: string | number;
  src: string;
  title: string;
  placement: string;
  price: string;
}

interface DesignsSectionProps {
  items?: Design[];
  onBookDesign?: (sketch: DisplaySketch) => void;
}

export function DesignsSection({ items, onBookDesign }: DesignsSectionProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 8;

  if (!items?.length) return null;

  const sketches: DisplaySketch[] = items.map((item) => ({
    id: item.id,
    src: item.image_url,
    title: item.name ?? "",
    placement: item.preferred_body_placement?.join(" · ") ?? "",
    price: item.price
      ? `${CURRENCY_SYMBOLS[item.currency as keyof typeof CURRENCY_SYMBOLS] ?? "$"}${item.price}`
      : "individual",
  }));

  return (
    <section
      id="sketches"
      className="bg-[#050505] py-12 md:py-20 px-6 md:px-16"
    >
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="label-caps text-white/35 mb-16"
        >
          Available designs
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
          {(showAll ? sketches : sketches.slice(0, INITIAL_COUNT)).map(
            (s, i) => (
              <motion.div
                key={s.id || i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.08,
                }}
                viewport={{ once: true }}
                className="cursor-pointer group bg-[#050505]"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="overflow-hidden relative">
                  {s.src && (
                    <>
                      <img
                        src={s.src}
                        alt={s.title}
                        className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
                    </>
                  )}
                </div>
                <div className="px-3 py-3 bg-[#0a0a0a]">
                  <div className="flex items-baseline justify-between gap-3 mb-0">
                    <p className="text-[11px] tracking-[0.06em] text-white/30 font-light truncate">
                      {s.title}
                    </p>
                    <p className="text-[11px] tracking-[0.06em] text-white/40 font-light shrink-0 whitespace-nowrap ml-auto">
                      {s.price}
                    </p>
                  </div>
                  <AnimatePresence>
                    {expanded === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        {s.placement && (
                          <p className="text-[10px] leading-[1.9] text-white/30 font-light mt-2 mb-3">
                            {s.placement}
                          </p>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookDesign?.(s);
                          }}
                          className="text-[10px] tracking-[0.1em] uppercase text-white/60 border-white/20 hover:text-white hover:border-white border-b pb-0.5 transition-all duration-300"
                        >
                          Book this flash{" "}
                          <span className="text-[9px] ml-0.5">↗</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ),
          )}
        </div>

        {sketches.length > INITIAL_COUNT && !showAll && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="text-[11px] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 border border-white/10 hover:border-white/30 px-8 py-3 transition-all duration-300"
            >
              Show all {sketches.length} designs
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
