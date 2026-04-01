"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FOOTER_LINKS = [
  { items: ["Product", "How it works", "Pricing"] },
  { items: ["Product", "How it works", "Pricing"] },
  { items: ["Product", "How it works", "Pricing"] },
];

export function Footer() {
  return (
    <footer
      className="bg-[#111113] relative overflow-hidden"
      style={{
        paddingTop: "clamp(4rem, 6vw, 6rem)",
        height: "clamp(360px, 40vw, 520px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: Follow Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-white text-base font-medium mb-6">Follow Us</h3>
            <div className="flex gap-2 max-w-xs">
              <Input
                placeholder="Gmail.Com"
                className="bg-transparent border-white/20 text-white placeholder:text-white/30 rounded-full px-5 focus-visible:ring-blue-500 text-sm"
              />
              <Button className="rounded-full px-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm whitespace-nowrap">
                Send
              </Button>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { label: "ig", name: "Instagram" },
                { label: "fb", name: "Facebook" },
                { label: "in", name: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  <span className="text-xs font-medium">{social.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-3 gap-8"
          >
            {FOOTER_LINKS.map((col, i) => (
              <ul key={i} className="space-y-5">
                {col.items.map((item) => (
                  <li key={`${i}-${item}`}>
                    <a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Brand name — absolute, bottom-aligned, overflows footer bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 px-4 md:px-8"
      >
        <h2
          className="text-white font-medium leading-none select-none"
          style={{
            fontSize: "20vw",
            letterSpacing: "-0.02em",
            marginBottom: "-0.12em",
          }}
        >
          Quarry ink
        </h2>
      </motion.div>
    </footer>
  );
}
