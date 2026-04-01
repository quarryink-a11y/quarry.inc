"use client";

import type { Review } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const FONT = "'Manrope', sans-serif";

interface DisplayReview {
  text: string;
  name: string;
  role: string;
  photo?: string | null;
  link?: string | null;
}

interface BentoReviewsSectionProps {
  reviews?: Review[];
}

export function BentoReviewsSection({
  reviews: reviewsProp,
}: BentoReviewsSectionProps) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const TEXT_LIMIT = 200;

  if (!reviewsProp?.length) return null;

  const reviews: DisplayReview[] = reviewsProp.map((r) => ({
    text: r.review_text,
    name: r.client_name ?? "",
    role: r.review_source ?? "client",
    photo: r.client_image_url ?? null,
    link: r.client_profile_url ?? null,
  }));

  const go = (d: number) => {
    setDir(d);
    setExpanded(false);
    setIndex((prev) => (prev + d + reviews.length) % reviews.length);
  };

  return (
    <section
      id="reviews"
      className="bg-black py-6 px-4 md:px-8"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[#141414] rounded-[20px] p-8 md:p-10 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.03, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="absolute right-6 -bottom-36 text-white font-bold select-none pointer-events-none"
              style={{ fontSize: "clamp(120px, 20vw, 280px)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>

          <div className="relative z-10">
            <span className="inline-flex items-center text-[10px] tracking-[0.15em] uppercase text-black bg-[#D0FD0A] px-3 py-1.5 rounded-full mb-8 font-medium">
              Reviews
            </span>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -50 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                <p className="text-[20px] md:text-[30px] leading-[1.45] text-white/70 font-extralight tracking-tight italic mb-10">
                  &ldquo;
                  {reviews[index].text.length > TEXT_LIMIT && !expanded
                    ? reviews[index].text.slice(0, TEXT_LIMIT).trimEnd() + "…"
                    : reviews[index].text}
                  &rdquo;
                </p>
                {reviews[index].text.length > TEXT_LIMIT && !expanded && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="mb-6 inline-flex items-center gap-1.5 text-[10px] tracking-[0.08em] text-white/50 hover:text-white transition-colors font-medium"
                  >
                    Read more <span>→</span>
                  </button>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {reviews[index].photo && (
                      <img
                        src={reviews[index].photo}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                    )}
                    <div>
                      {reviews[index].link ? (
                        <a
                          href={reviews[index].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[16px] text-white/70 hover:text-white font-normal transition-colors"
                        >
                          {reviews[index].name}
                        </a>
                      ) : (
                        <p className="text-[16px] text-white/70 font-regular">
                          {reviews[index].name}
                        </p>
                      )}
                      <p className="text-[10px] tracking-[0.1em] uppercase text-white/25 font-medium">
                        {reviews[index].role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => go(-1)}
                      className="w-10 h-10 rounded-full border border-white/20 bg-transparent flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => go(1)}
                      className="w-10 h-10 rounded-full border border-white/20 bg-transparent flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
