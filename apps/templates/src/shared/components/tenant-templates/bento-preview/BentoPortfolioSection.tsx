"use client";

import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import type { Portfolio } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
const FONT = "'Manrope', sans-serif";

interface DisplayWork {
  id?: string | number;
  src?: string;
  size: string;
  sizeVal: string;
  price: string;
}

function PortfolioCard({
  work,
  onClick,
  className = "",
}: {
  work: DisplayWork;
  onClick: (w: DisplayWork) => void;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`group cursor-pointer rounded-[16px] overflow-hidden bg-[#1e1e1e] relative ${className}`}
      onClick={() => onClick(work)}
    >
      {work.src && (
        <img
          src={work.src}
          alt="tattoo"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 absolute inset-0"
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <p
          className="text-[16px] font-normal text-white/90"
          style={{ fontFamily: FONT }}
        >
          {work.size}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <span
            className="text-[10px] text-white/50 font-medium"
            style={{ fontFamily: FONT }}
          >
            {work.sizeVal}
          </span>
          <span
            className="text-[10px] text-white/50 font-medium"
            style={{ fontFamily: FONT }}
          >
            {work.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function NavCard({
  page,
  totalPages,
  goPrev,
  goNext,
}: {
  page: number;
  totalPages: number;
  goPrev: () => void;
  goNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-[#141414] rounded-[16px] p-6 flex flex-col justify-between h-full"
    >
      <h3 className="text-[28px] md:text-[30px] font-normal text-[#D0FD0A] leading-tight tracking-tight uppercase">
        Portfolio /<br />
        Prices
      </h3>
      <div className="flex items-center gap-3">
        <button
          onClick={goPrev}
          disabled={page === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            page === 0
              ? "bg-[#2a2a2a] text-white/20"
              : "bg-[#D6D6D6] text-black hover:bg-white"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          onClick={goNext}
          disabled={page >= totalPages - 1}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            page >= totalPages - 1
              ? "bg-[#2a2a2a] text-white/20"
              : "bg-[#D6D6D6] text-black hover:bg-white"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

interface BentoPortfolioSectionProps {
  items?: Portfolio[];
}

export function BentoPortfolioSection({ items }: BentoPortfolioSectionProps) {
  const [lightbox, setLightbox] = useState<DisplayWork | null>(null);
  const [page, setPage] = useState(0);

  if (!items?.length) return null;

  const works: DisplayWork[] = items.map((item) => ({
    id: item.id,
    src: item.image_url,
    size: "Medium",
    sizeVal: item.size
      ? `${item.size} ${item.size_unit?.toLowerCase() ?? "cm"}`
      : "",
    price: item.price
      ? `${CURRENCY_SYMBOLS[item.currency as keyof typeof CURRENCY_SYMBOLS] || "$"} ${item.price.toLocaleString()}`
      : "individual",
  }));

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(works.length / ITEMS_PER_PAGE);
  const startIdx = page * ITEMS_PER_PAGE;
  const pageWorks = works.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section
      id="portfolio"
      className="bg-black py-6 px-4 md:px-8"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="hidden md:block">
          <div
            className="grid gap-3 mb-3"
            style={{ gridTemplateColumns: "1fr 1fr 2fr", height: "340px" }}
          >
            {pageWorks[0] && (
              <PortfolioCard
                work={pageWorks[0]}
                onClick={setLightbox}
                className="h-full"
              />
            )}
            {pageWorks[1] && (
              <PortfolioCard
                work={pageWorks[1]}
                onClick={setLightbox}
                className="h-full"
              />
            )}
            {pageWorks[2] && (
              <PortfolioCard
                work={pageWorks[2]}
                onClick={setLightbox}
                className="h-full"
              />
            )}
          </div>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "1.5fr 1.5fr 1fr", height: "340px" }}
          >
            {pageWorks[3] && (
              <PortfolioCard
                work={pageWorks[3]}
                onClick={setLightbox}
                className="h-full"
              />
            )}
            {pageWorks[4] && (
              <PortfolioCard
                work={pageWorks[4]}
                onClick={setLightbox}
                className="h-full"
              />
            )}
            <NavCard
              page={page}
              totalPages={totalPages}
              goPrev={goPrev}
              goNext={goNext}
            />
          </div>
        </div>

        <div className="md:hidden grid grid-cols-2 gap-3">
          {pageWorks.map((w) => (
            <PortfolioCard
              key={w.id}
              work={w}
              onClick={setLightbox}
              className="aspect-[3/4]"
            />
          ))}
          <NavCard
            page={page}
            totalPages={totalPages}
            goPrev={goPrev}
            goNext={goNext}
          />
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              src={lightbox.src}
              className="max-h-[88vh] max-w-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-8 text-white/40 hover:text-white text-[10px] tracking-[0.1em] uppercase transition-colors font-medium"
            >
              close ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
