"use client";

import type { AboutBlock } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    duration: 1,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay,
  },
  viewport: { once: true },
});

const MAX_CHARS = 300;

function TextBlock({ paragraphs }: { paragraphs: string[] }) {
  const fullText = paragraphs.join("\n");
  const isLong = fullText.length > MAX_CHARS;
  const [expanded, setExpanded] = useState(false);

  const visibleParagraphs =
    !isLong || expanded
      ? paragraphs
      : (() => {
          let charCount = 0;
          const result: string[] = [];
          for (const p of paragraphs) {
            if (charCount + p.length > MAX_CHARS) {
              const remaining = MAX_CHARS - charCount;
              if (remaining > 20) result.push(p.substring(0, remaining) + "…");
              break;
            }
            result.push(p);
            charCount += p.length;
          }
          return result.length > 0
            ? result
            : [paragraphs[0].substring(0, MAX_CHARS) + "…"];
        })();

  return (
    <div>
      {visibleParagraphs.map((p, i) => (
        <p
          key={i}
          className="text-[13px] leading-[2.1] text-white/40 font-light mb-4"
        >
          {p}
        </p>
      ))}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] tracking-[0.15em] uppercase text-white/50 hover:text-white/70 border-white/20 transition-colors mt-1 border-b pb-0.5"
        >
          {expanded ? "← Show less" : "Read more →"}
        </button>
      )}
    </div>
  );
}

interface AboutSectionProps {
  photoUrl?: string | null;
  aboutText?: string | null;
  aboutBlocks?: AboutBlock[];
  title?: string;
  paragraphs?: string[];
}

export function AboutSection({
  photoUrl,
  aboutText,
  aboutBlocks,
  title,
  paragraphs,
}: AboutSectionProps) {
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
        slides.push({ title: block.title || null, paragraphs: p });
      }
    });
  }

  if (slides.length === 0 && (paragraphs?.length || title)) {
    slides.push({ title: title ?? null, paragraphs: paragraphs ?? [] });
  }

  if (!photo && slides.length === 0) return null;

  const hasMultipleSlides = slides.length > 1;
  const currentSlide = slides[activeTab] || slides[0];

  const goNext = () =>
    setActiveTab((prev) => Math.min(prev + 1, slides.length - 1));
  const goPrev = () => setActiveTab((prev) => Math.max(prev - 1, 0));

  return (
    <section id="about" className="bg-[#050505] py-12 md:py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="label-caps text-white/35 mb-16"
        >
          About
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          {photo && (
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
              viewport={{ once: true }}
              className="group relative overflow-hidden"
            >
              <img
                src={photo}
                alt="Artist"
                className="w-full h-auto object-cover grayscale group-hover:grayscale-0"
                style={{ transition: "filter 3s ease-out" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          )}

          <div className="flex flex-col justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                {currentSlide.title && (
                  <h3 className="text-[28px] md:text-[36px] font-light text-white leading-[1.2] mb-6 tracking-tight">
                    {currentSlide.title}
                  </h3>
                )}
                <TextBlock paragraphs={currentSlide.paragraphs} />
              </motion.div>
            </AnimatePresence>

            {hasMultipleSlides && (
              <motion.div
                {...fadeUp(0.2)}
                className="flex items-center gap-4 mt-8"
              >
                <button
                  onClick={goPrev}
                  disabled={activeTab === 0}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    activeTab === 0
                      ? "border-white/5 text-white/15 cursor-default"
                      : "border-white/20 text-white/50 hover:border-white/40 hover:text-white"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <span className="text-[11px] tracking-[0.15em] uppercase text-white/30 font-light">
                  {activeTab + 1} / {slides.length}
                </span>
                <button
                  onClick={goNext}
                  disabled={activeTab === slides.length - 1}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    activeTab === slides.length - 1
                      ? "border-white/5 text-white/15 cursor-default"
                      : "border-white/20 text-white/50 hover:border-white/40 hover:text-white"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
