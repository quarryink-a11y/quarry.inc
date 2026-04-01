"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

import { ArtistCard } from "./ArtistCard";

const ARTISTS = [
  {
    name: "Marcus Rivera",
    specialty: "Website Profit",
    image:
      "https://media.base44.com/images/public/69b03f938ed1d3967eceb51f/af4bf695e_generated_5a30059b.png",
  },
  {
    name: "Yuki Tanaka",
    specialty: "Website Profit",
    image:
      "https://media.base44.com/images/public/69b03f938ed1d3967eceb51f/798325660_generated_a7fa271e.png",
  },
  {
    name: "Leo Andersen",
    specialty: "Website Profit",
    image:
      "https://media.base44.com/images/public/69b03f938ed1d3967eceb51f/d0281a94e_generated_32bc45f3.png",
  },
];

export function ArtistsSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
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
    <section className="bg-white py-20 md:py-32" id="artists">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[clamp(2.5rem,9vw,7.5rem)] font-extralight text-gray-900 leading-[1]"
          >
            Artists Who
            <br />
            Trust Quarry <span className="text-gray-300">—</span>
          </motion.h2>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className={`w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 ${
                !canScrollLeft ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {ARTISTS.map((artist, i) => (
            <ArtistCard key={artist.name} artist={artist} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
