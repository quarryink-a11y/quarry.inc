"use client";

import type { AboutBlock } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const FONT = "'Manrope', sans-serif";

interface BentoAboutSectionProps {
  photoUrl?: string;
  aboutText?: string;
  aboutBlocks?: AboutBlock[];
  title?: string;
  paragraphs?: string[];
}

export function BentoAboutSection({
  photoUrl,
  aboutText,
  aboutBlocks,
  title,
  paragraphs,
}: BentoAboutSectionProps) {
  const photo = photoUrl ?? null;
  const [activeTab, setActiveTab] = useState(0);

  const slides: { title: string | null; paragraphs: string[] }[] = [];
  if (aboutText) {
    slides.push({
      title: null,
      paragraphs: aboutText.split("\n").filter((p) => p.trim()),
    });
  }
  if (aboutBlocks && aboutBlocks.length > 0) {
    aboutBlocks.forEach((block) => {
      if (block.title || block.text) {
        const p = block.text
          ? block.text.split("\n").filter((s) => s.trim())
          : [];
        slides.push({ title: block.title ?? null, paragraphs: p });
      }
    });
  }
  if (slides.length === 0 && (paragraphs?.length || title)) {
    slides.push({
      title: title ?? null,
      paragraphs: paragraphs ?? [],
    });
  }

  if (!photo && slides.length === 0) return null;

  const hasMultipleSlides = slides.length > 1;
  const currentSlide = slides[activeTab] || slides[0];
  const goNext = () =>
    setActiveTab((prev) => Math.min(prev + 1, slides.length - 1));
  const goPrev = () => setActiveTab((prev) => Math.max(prev - 1, 0));

  return (
    <section
      id="about"
      className="bg-[#E5E5E5] py-6 px-4 md:px-8"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="bg-[#D6D6D6] rounded-[20px] overflow-hidden relative min-w-0 h-100 md:h-full"
            >
              <div className="absolute top-5 left-5 z-10">
                <span className="inline-flex items-center text-[10px] tracking-[0.1em] uppercase text-black/70 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full font-medium border border-black/5">
                  About
                </span>
              </div>
              <img
                src={photo}
                alt="Artist"
                className="w-full h-full object-cover grayscale"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-[#D6D6D6] rounded-[20px] p-8 md:p-10 flex flex-col justify-between min-w-0 h-full overflow-hidden"
          >
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentSlide.title && (
                    <h3 className="text-[24px] md:text-[30px] font-normal text-black leading-[1.25] mb-5 tracking-tight">
                      {currentSlide.title}
                    </h3>
                  )}
                  <div>
                    {currentSlide.paragraphs.map((p, i) => (
                      <p
                        key={i}
                        className="text-[16px] leading-[1.8] text-black/50 font-light mb-3 wrap-break-word"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {hasMultipleSlides && (
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-black/[0.08]">
                <button
                  onClick={goPrev}
                  disabled={activeTab === 0}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    activeTab === 0
                      ? "border-black/5 text-black/15"
                      : "border-black/20 text-black/50 hover:border-black hover:text-black"
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <span className="text-[11px] tracking-[0.1em] text-black/25 font-light">
                  {activeTab + 1} / {slides.length}
                </span>
                <button
                  onClick={goNext}
                  disabled={activeTab === slides.length - 1}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    activeTab === slides.length - 1
                      ? "border-black/5 text-black/15"
                      : "border-black/20 text-black/50 hover:border-black hover:text-black"
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
