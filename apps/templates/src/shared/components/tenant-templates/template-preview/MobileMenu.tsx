"use client";

import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navItems?: string[];
  onBookClick?: () => void;
}

export function MobileMenu({
  open,
  onClose,
  navItems = [],
  onBookClick,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center"
            >
              <div className="relative w-6 h-6">
                <span className="absolute top-1/2 left-0 w-full h-px bg-white/70 rotate-45" />
                <span className="absolute top-1/2 left-0 w-full h-px bg-white/70 -rotate-45" />
              </div>
            </button>
            <button
              onClick={() => {
                onClose();
                onBookClick?.();
              }}
              className="flex items-center gap-2 text-[12px] tracking-[0.08em] text-white/80 font-medium"
            >
              Book an appointment
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-1">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="text-[26px] font-light text-white/85 hover:text-white tracking-[0.01em] py-2.5 transition-colors duration-300"
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
