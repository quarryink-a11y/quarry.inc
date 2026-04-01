"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

const DESIGN_IMG_1 =
  "https://media.base44.com/images/public/69b03f938ed1d3967eceb51f/02743f958_generated_3c12f9f3.png";
const DESIGN_IMG_2 =
  "https://media.base44.com/images/public/69b03f938ed1d3967eceb51f/eb6be5a5e_generated_77f9b3ec.png";

const DESIGNS = [
  {
    name: "Product name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim",
    images: [DESIGN_IMG_1, DESIGN_IMG_2],
  },
  {
    name: "Product name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim",
    images: [DESIGN_IMG_2, DESIGN_IMG_1],
  },
  {
    name: "Product name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim",
    images: [DESIGN_IMG_1, DESIGN_IMG_2],
  },
];

export function DesignsSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 700;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
    setTimeout(() => {
      if (scrollRef.current) {
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      }
    }, 400);
  };

  return (
    <section
      className="py-20 md:py-28 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(37,99,235,0.15) 0%, transparent 60%), #0a0a0f",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[clamp(2.5rem,9vw,7.5rem)] leading-[1] font-light text-white tracking-tight"
          >
            Designes. <span className="text-white/30">—</span>
          </motion.h2>

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => scroll("left")}
              className={`w-14 h-14 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 ${
                !canScrollLeft ? "opacity-35" : ""
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-14 h-14 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex gap-10 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {DESIGNS.map((design, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-shrink-0 w-[580px]"
            >
              {/* Text above images */}
              <div className="mb-5">
                <h3 className="text-base font-semibold text-white">
                  {design.name}
                </h3>
                <p className="mt-2 text-sm text-white/40 leading-relaxed max-w-md">
                  {design.description}
                </p>
              </div>

              {/* Two side-by-side tablet mockups */}
              <div className="grid grid-cols-2 gap-4">
                {design.images.map((img, j) => (
                  <div
                    key={j}
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: "16px",
                      background: "#1a1a1f",
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "10px",
                    }}
                  >
                    {/* Tablet top bar simulation */}
                    <div className="flex items-center gap-1.5 mb-2 px-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/60" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                      <div className="w-2 h-2 rounded-full bg-green-500/60" />
                    </div>
                    <div
                      className="overflow-hidden"
                      style={{ borderRadius: "8px" }}
                    >
                      <img
                        src={img}
                        alt={`${design.name} preview ${j + 1}`}
                        className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-500"
                        style={{ display: "block" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
