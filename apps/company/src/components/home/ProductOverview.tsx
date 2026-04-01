"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";

const FEATURES = [
  {
    title: "A Professional Website in 5 Minutes",
    description:
      "Ready-to-use templates designed for the tattoo industry. Your portfolio, booking, pricing, and contact details — perfectly structured from the start.",
    highlighted: true,
  },
  {
    title: "A Professional Website in 5 Minutes",
    description:
      "Ready-to-use templates designed for the tattoo industry. Your portfolio, booking, pricing, and contact details — perfectly structured from the start.",
    highlighted: false,
  },
  {
    title: "A Professional Website in 5 Minutes",
    description:
      "Ready-to-use templates designed for the tattoo industry. Your portfolio, booking, pricing, and contact details — perfectly structured from the start.",
    highlighted: false,
  },
  {
    title: "A Professional Website in 5 Minutes",
    description:
      "Ready-to-use templates designed for the tattoo industry. Your portfolio, booking, pricing, and contact details — perfectly structured from the start.",
    highlighted: false,
  },
];

export function ProductOverview() {
  return (
    <section
      className="bg-[#F5F5F7] py-20 md:py-28 border-t border-gray-200"
      id="product"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title full width */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(2.5rem,9vw,7.5rem)] leading-[1] font-light text-gray-900 tracking-tight mb-16"
        >
          Product Overview. <span className="text-gray-300">—</span>
        </motion.h2>

        {/* Subtitle right-aligned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-xl font-medium text-gray-900 leading-snug">
              A platform built specifically for tattoo artists.
            </p>
            <p className="mt-2 text-xl text-gray-400 leading-snug">
              Your website, business tools,
              <br />
              and marketing — all in one
              <br />
              place.
            </p>
          </motion.div>
        </div>

        {/* Feature cards 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`rounded-2xl border border-gray-200 p-7 flex gap-4 ${
                feature.highlighted
                  ? "bg-gradient-to-br from-[#dde6fa] via-[#e8eef9] to-[#f0f4fd]"
                  : "bg-white"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Globe size={16} className="text-gray-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {feature.title}
                </h4>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
