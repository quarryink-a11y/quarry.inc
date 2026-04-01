"use client";

import { motion } from "framer-motion";
import { Fragment, useState } from "react";

import { MobileMenu } from "../template-preview/MobileMenu";
import { BentoFluidCanvas } from "./BentoFluidCanvas";

const DEFAULT_NAV = [
  "About",
  "How to book",
  "Portfolio",
  "Events",
  "FAQ",
  "Contact",
];

interface BentoHeroSectionProps {
  headline?: string;
  intro?: string;
  shortDescription?: string;
  navItems?: string[];
  heroMediaType?: "video" | "image";
  heroMediaUrl?: string;
  onBookClick?: () => void;
}

export function BentoHeroSection({
  headline,
  intro,
  navItems,
  heroMediaType,
  heroMediaUrl,
  onBookClick,
}: BentoHeroSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPreview = headline === undefined;
  const displayName = isPreview ? "KYRYLO\nSEREBRIANSKYI" : headline || "";
  const displayIntro = isPreview
    ? "Tattoo Artist · Kyiv / Calgary"
    : intro || null;
  const nav = navItems === undefined ? DEFAULT_NAV : navItems || [];

  const nameLines = displayName.includes("\n")
    ? displayName.split("\n")
    : displayName.split(" ").length >= 2
      ? [
          displayName.split(" ").slice(0, -1).join(" "),
          displayName.split(" ").slice(-1)[0],
        ]
      : [displayName];

  const hasCustomMedia = !!heroMediaUrl;

  return (
    <section
      className="relative w-full bg-black overflow-hidden"
      style={{ height: "100svh", fontFamily: "'Manrope', sans-serif" }}
    >
      {hasCustomMedia ? (
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
        <BentoFluidCanvas />
      )}

      <div className="absolute inset-0 bg-black/15" />

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-10 py-4 md:py-5"
      >
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-[7px] w-11 h-11 md:w-9 md:h-9 justify-center group"
        >
          <span className="w-7 md:w-5 h-[1.5px] bg-white/70 group-hover:bg-[#D0FD0A] transition-colors" />
          <span className="w-7 md:w-5 h-[1.5px] bg-white/70 group-hover:bg-[#D0FD0A] transition-colors" />
        </button>
        <button
          onClick={onBookClick}
          className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.1] rounded-full pl-5 md:pl-5 pr-1.5 py-2 md:py-1.5 hover:bg-white/[0.14] transition-all group"
        >
          <span className="text-[11px] md:text-[10px] tracking-[0.1em] uppercase text-white/80 font-medium">
            Book an appointment
          </span>
          <span className="w-8 h-8 md:w-7 md:h-7 rounded-full bg-[#D0FD0A] flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </motion.nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={nav}
        onBookClick={onBookClick}
      />

      <div className="absolute inset-0 z-10 flex flex-col justify-end md:justify-center items-start md:items-center text-left md:text-center px-5 md:px-4 pb-20 md:pb-0">
        <h1
          className="text-[11.5vw] md:text-[10vw] lg:text-[9vw] font-medium leading-[0.88] tracking-[-0.03em] select-none uppercase"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 500,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.15) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {nameLines.map((line, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h1>

        {displayIntro && (
          <p className="text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-white/35 mt-5 md:mt-7 font-medium">
            {displayIntro}
          </p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <div className="w-6 h-10 border border-white/15 rounded-full flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-[#D0FD0A]"
          />
        </div>
      </motion.div>
    </section>
  );
}
