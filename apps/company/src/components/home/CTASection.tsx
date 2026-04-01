"use client";

import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="bg-[#111113] py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-[#2563EB] rounded-3xl p-10 md:p-16 overflow-hidden"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-transparent to-blue-700/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <h2 className="text-[clamp(2rem,6vw,5rem)] font-extralight text-white leading-[1.1]">
                Have A Question
                <br />
                Or Want To Get
                <br />
                Started?
              </h2>
              <p className="mt-6 text-sm text-white/60 tracking-wide">
                Message Us — We&apos;ll Reply Within 24 Hours.
              </p>
            </div>

            <a
              href="#"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full border border-white/40 flex items-center justify-center text-white text-sm font-light tracking-wide hover:bg-white hover:text-blue-600 transition-all duration-500 flex-shrink-0"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
