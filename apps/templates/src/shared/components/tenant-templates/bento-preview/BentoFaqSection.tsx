"use client";

import type { FaqCategory } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const FONT = "'Manrope', sans-serif";

interface BentoFaqSectionProps {
  categories?: FaqCategory[];
}

export function BentoFaqSection({ categories: catProp }: BentoFaqSectionProps) {
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [openQ, setOpenQ] = useState<string | null>(null);

  if (!catProp?.length) return null;

  const categories = catProp
    .map((cat) => ({
      title: cat.title,
      questions: (cat.items || [])
        .filter((q) => q.answer && q.answer.trim().length > 0)
        .map((q) => ({ q: q.question, a: q.answer! })),
    }))
    .filter((c) => c.questions.length > 0);

  if (categories.length === 0) return null;

  const toggleCat = (ci: number) => {
    setOpenCat(openCat === ci ? null : ci);
    setOpenQ(null);
  };

  return (
    <section
      id="faq"
      className="bg-black py-6 px-4 md:px-8"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-6xl mx-auto">
        <span className="inline-flex items-center text-[10px] tracking-[0.15em] uppercase text-black bg-[#D0FD0A] px-3 py-1.5 rounded-full mb-4 font-medium">
          FAQ
        </span>
        <div className="space-y-3">
          {categories.map((cat, ci) => {
            const isOpen = openCat === ci;
            return (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: ci * 0.05 }}
                viewport={{ once: true }}
                className={`rounded-[18px] overflow-hidden transition-colors duration-300 ${
                  isOpen
                    ? "bg-[#141414]"
                    : "bg-[#141414] border border-white/[0.06]"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 md:px-8 py-5 md:py-6 text-left group"
                  onClick={() => toggleCat(ci)}
                >
                  <span className="text-[16px] md:text-[20px] font-light text-white/60 group-hover:text-white/90 transition-colors tracking-[0.04em] uppercase">
                    {cat.title}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 ml-4 text-[#D0FD0A]"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 space-y-0">
                        {cat.questions.map((item, qi) => {
                          const qKey = `${ci}-${qi}`;
                          const isQOpen = openQ === qKey;
                          return (
                            <div
                              key={qi}
                              className="border-b border-white/[0.06] last:border-b-0"
                            >
                              <button
                                className="w-full flex items-center justify-between py-4 text-left group"
                                onClick={() => setOpenQ(isQOpen ? null : qKey)}
                              >
                                <span className="text-[14px] md:text-[16px] text-white/40 group-hover:text-white/70 font-extralight pr-6 leading-[1.6] transition-colors">
                                  {item.q}
                                </span>
                                <motion.span
                                  animate={{ rotate: isQOpen ? 45 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-[#D0FD0A] text-[18px] font-light shrink-0"
                                >
                                  {isQOpen ? "×" : "+"}
                                </motion.span>
                              </button>
                              <AnimatePresence initial={false}>
                                {isQOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="text-[14px] md:text-[15px] leading-[1.8] text-white/30 font-extralight pb-4 whitespace-pre-line">
                                      {item.a}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
