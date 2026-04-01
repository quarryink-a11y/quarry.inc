"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const HERO_IMAGE =
  "https://media.base44.com/images/public/69b03f938ed1d3967eceb51f/1550b3d3d_generated_1c6b1615.png";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full bg-gradient-to-b from-[#0a0a1a] via-[#0d1033] to-[#0a0a1a] overflow-hidden">
      {/* Radial glow — bright blue center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(37,99,235,0.55)_0%,rgba(29,78,216,0.25)_40%,transparent_75%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_35%,rgba(59,130,246,0.30)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2.5rem,8vw,7.5rem)] leading-[1.05] font-extralight text-white tracking-tight"
        >
          Digital Platform <span className="text-white/50">Made</span>
          <br />
          <span className="text-white/50">Specifically For</span>
          <br />
          Tattoo Artists
        </motion.h1>

        {/* Start Now button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-end mt-[-4rem] md:mt-[-6rem] mb-8"
        >
          <Link
            href="/account"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border border-white/30 flex items-center justify-center text-white text-sm md:text-base font-light tracking-wide hover:bg-white hover:text-black transition-all duration-500"
          >
            Start Now
          </Link>
        </motion.div>

        {/* 3D Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-3xl mx-auto mt-4"
        >
          <div className="rounded-2xl overflow-hidden">
            <img
              src={HERO_IMAGE}
              alt="Abstract 3D geometric shapes"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>

        {/* Description section */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div />
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-lg md:text-xl text-white leading-relaxed"
            >
              <span className="font-semibold">
                Launch your professional website
              </span>{" "}
              <span className="text-white/60">
                exclusively for the tattoo niche today.
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 text-sm text-white/40 leading-relaxed"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-sm text-white/40 leading-relaxed"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
