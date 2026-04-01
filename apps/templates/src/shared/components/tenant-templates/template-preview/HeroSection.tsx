"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { FluidCanvas } from "./FluidCanvas";
import { MobileMenu } from "./MobileMenu";

const DEFAULT_NAV = [
  "About",
  "How to book",
  "Portfolio",
  "Events",
  "FAQ",
  "Contact",
];

interface HeroSectionProps {
  headline?: string;
  intro?: string;
  shortDescription?: string;
  navItems?: string[];
  heroMediaType?: string;
  heroMediaUrl?: string;
  onBookClick?: () => void;
}

export function HeroSection({
  headline,
  intro,
  navItems,
  heroMediaType,
  heroMediaUrl,
  onBookClick,
}: HeroSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPreview = headline === undefined;
  const displayName = isPreview ? "KAZAKEVICH\nANDRIY" : headline || "";
  const displayIntro = isPreview
    ? "Tattoo Artist · Kyiv / Calgary"
    : (intro ?? null);
  const nav = navItems === undefined ? DEFAULT_NAV : navItems || [];

  const nameLines = displayName.includes("\n")
    ? displayName.split("\n")
    : displayName.split(" ").length >= 2
      ? [
          displayName.split(" ").slice(0, -1).join(" "),
          displayName.split(" ").slice(-1)[0],
        ]
      : [displayName];

  return (
    <section
      className="relative w-full bg-black overflow-hidden"
      style={{ height: "100vh" }}
    >
      {heroMediaUrl ? (
        heroMediaType === "video" ? (
          <video
            src={heroMediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${heroMediaUrl})` }}
          />
        )
      ) : (
        <FluidCanvas />
      )}
      <div className="absolute inset-0 bg-black/40" />

      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center gap-8 md:gap-14 px-6 py-6">
        {nav.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
            className="text-[13px] tracking-[0.12em] text-white/60 hover:text-white transition-colors hidden md:block font-light"
          >
            {item}
          </a>
        ))}

        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex flex-col items-center justify-center gap-[6px] w-10 h-10 absolute right-6 top-5"
        >
          <span className="w-6 h-px bg-white/70" />
          <span className="w-6 h-px bg-white/70" />
        </button>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={nav}
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        {displayIntro && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[9px] tracking-[0.45em] uppercase text-white/40 mb-8 font-light"
          >
            {displayIntro}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[13vw] md:text-[11vw] lg:text-[10vw] font-light leading-[0.88] tracking-[0.02em] text-white select-none uppercase"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {nameLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={onBookClick}
            className="px-10 py-3.5 text-[10px] tracking-[0.3em] uppercase text-black bg-white hover:bg-white hover:scale-110 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 active:scale-100"
          >
            book an appointment
          </button>
          <a
            href="#portfolio"
            className="px-10 py-3.5 text-[10px] tracking-[0.3em] uppercase text-white/70 hover:text-white border border-white/20 hover:border-white/50 transition-all duration-300"
          >
            view portfolio
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] tracking-[0.4em] uppercase text-white/30">
          scroll
        </span>
        <div className="w-px h-8 bg-white/20" />
      </motion.div>
    </section>
  );
}
