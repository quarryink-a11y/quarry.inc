"use client";

import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import type { Portfolio } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface DisplayWork {
  id: string | number;
  src: string;
  size: string;
  price: string;
}

interface PortfolioSectionProps {
  items?: Portfolio[];
}

export function PortfolioSection({ items }: PortfolioSectionProps) {
  const [lightbox, setLightbox] = useState<DisplayWork | null>(null);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 8;

  if (!items?.length) return null;

  const works: DisplayWork[] = items.map((item) => ({
    id: item.id,
    src: item.image_url,
    size: item.size
      ? `${item.size} ${item.size_unit?.toLowerCase() ?? "cm"}`
      : "",
    price: item.price
      ? `from ${CURRENCY_SYMBOLS[item.currency as keyof typeof CURRENCY_SYMBOLS] ?? "$"} ${item.price.toLocaleString()}`
      : "individual",
  }));

  return (
    <section
      id="portfolio"
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
          Portfolio
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
          {(showAll ? works : works.slice(0, INITIAL_COUNT)).map((w, i) => (
            <motion.div
              key={w.id || i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.05,
              }}
              viewport={{ once: true }}
              className="cursor-pointer group bg-[#050505] overflow-hidden"
              onClick={() => setLightbox(w)}
            >
              <div className="overflow-hidden relative">
                {w.src && (
                  <>
                    <img
                      src={w.src}
                      alt="tattoo"
                      className="w-full h-[200px] md:h-[260px] object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
                  </>
                )}
              </div>
              <div className="px-3 py-3 bg-[#0a0a0a] min-h-[48px] flex flex-col justify-center">
                {w.size || w.price !== "individual" ? (
                  <div className="flex items-baseline justify-between gap-3">
                    {w.size && (
                      <span className="text-[11px] tracking-[0.06em] text-white/30 font-light truncate">
                        {w.size}
                      </span>
                    )}
                    <span className="text-[11px] tracking-[0.06em] text-white/40 font-light whitespace-nowrap shrink-0 ml-auto">
                      {w.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] tracking-[0.06em] text-white/25 font-light italic">
                    {w.price}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {works.length > INITIAL_COUNT && !showAll && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="text-[11px] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 border border-white/10 hover:border-white/30 px-8 py-3 transition-all duration-300"
            >
              Show all {works.length} works
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              src={lightbox.src}
              className="max-h-[88vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-8 text-white/40 hover:text-white transition-colors label-caps"
            >
              close ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
