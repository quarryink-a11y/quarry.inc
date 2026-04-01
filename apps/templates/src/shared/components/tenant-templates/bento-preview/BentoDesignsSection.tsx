"use client";

import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import type { Design } from "@shared/types/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
const FONT = "'Manrope', sans-serif";

interface DisplaySketch {
  id?: string | number;
  src?: string;
  title: string;
  placement: string;
  price: string;
}

interface BentoDesignsSectionProps {
  items?: Design[];
  onBookDesign?: (sketch: DisplaySketch) => void;
}

export function BentoDesignsSection({
  items,
  onBookDesign,
}: BentoDesignsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const INITIAL_DESKTOP = 6;
  const INITIAL_MOBILE = 3;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!items?.length) return null;

  const sketches: DisplaySketch[] = items.map((item) => ({
    id: item.id,
    src: item.image_url,
    title: item.name ?? "",
    placement: item.preferred_body_placement?.join(", ") ?? "",
    price: item.price
      ? `${CURRENCY_SYMBOLS[item.currency as keyof typeof CURRENCY_SYMBOLS] ?? "$"}${item.price}`
      : "individual",
  }));

  const initialCount = isMobile ? INITIAL_MOBILE : INITIAL_DESKTOP;

  return (
    <section
      id="sketches"
      className="bg-[#1e1e1e] pt-16 pb-6 px-4 md:px-8"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-6xl mx-auto">
        <span className="inline-flex items-center text-[10px] tracking-[0.15em] uppercase text-black bg-[#D0FD0A] px-3 py-1.5 rounded-full mb-4 font-medium">
          Designs
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {(showAll ? sketches : sketches.slice(0, initialCount)).map(
            (s, i) => (
              <motion.div
                key={s.id || i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-[#141414] rounded-[16px] overflow-hidden group"
              >
                <div className="overflow-hidden">
                  {s.src && (
                    <img
                      src={s.src}
                      alt={s.title}
                      className="w-full aspect-[4/4] object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <p className="text-[18px] font-light text-white/80 uppercase tracking-wide truncate">
                      {s.title}
                    </p>
                    <p className="text-[16px] text-[#D0FD0A] font-medium shrink-0">
                      {s.price}
                    </p>
                  </div>
                  {s.placement && (
                    <p className="text-[16px] leading-[1.7] text-white/30 font-extralight mb-4">
                      {s.placement}
                    </p>
                  )}
                  <button
                    onClick={() => onBookDesign?.(s)}
                    className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] rounded-full pl-5 pr-1.5 py-1.5 hover:bg-white/[0.12] transition-all"
                  >
                    <span className="text-[10px] tracking-[0.1em] uppercase text-white/70 font-medium">
                      Book this flash
                    </span>
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </motion.div>
            ),
          )}
        </div>

        {!showAll && sketches.length > initialCount && (
          <div className="flex justify-center mt-5">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.12em] uppercase text-black font-semibold bg-[#D0FD0A] hover:bg-[#bde80a] pl-6 pr-2 py-2.5 rounded-full transition-all"
            >
              View more ({sketches.length - initialCount})
              <span className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
