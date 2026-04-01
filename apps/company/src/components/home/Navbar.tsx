"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

// const NAV_LEFT = ["Product", "How it works", "Pricing"];
const NAV_LEFT = [
  {
    title: "Product",
    href: "#product",
  },
  {
    title: "How it works",
    href: "#how-it-works",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
];
const NAV_RIGHT = [
  {
    title: "Results",
    href: "#results",
  },
  {
    title: "About",
    href: "#about",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          {/* Left nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LEFT.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="text-sm text-white/70 hover:text-white transition-colors duration-300 tracking-wide"
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* Logo */}
          <a href="#" className="text-white text-lg font-light tracking-widest">
            Quarry ink
          </a>

          {/* Right nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_RIGHT.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="text-sm text-white/70 hover:text-white transition-colors duration-300 tracking-wide"
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl text-white/80 hover:text-white transition-colors font-light tracking-wide"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
