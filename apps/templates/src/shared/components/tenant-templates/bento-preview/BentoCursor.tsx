"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function BentoCursor() {
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hoverLabel, setHoverLabel] = useState("");

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const ringX = useSpring(mx, { stiffness: 120, damping: 28, mass: 0.4 });
  const ringY = useSpring(my, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.matchMedia("(pointer: coarse)").matches ||
          window.innerWidth < 768,
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor]",
      );
      if (interactive) {
        setHovered(true);
        setHoverLabel(interactive.getAttribute("data-cursor") || "");
      }
    };

    const out = (e: MouseEvent) => {
      const t = e.relatedTarget as HTMLElement | null;
      if (
        !t?.closest?.(
          "a, button, [role='button'], input, textarea, select, [data-cursor]",
        )
      ) {
        setHovered(false);
        setHoverLabel("");
      }
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.style.cursor = "";
    };
  }, [isMobile, mx, my]);

  if (isMobile) return null;

  const dotSize = pressed ? 3 : hovered ? 0 : 5;
  const ringSize = hovered ? 56 : pressed ? 20 : 32;

  return (
    <>
      <motion.div
        style={{ x: mx, y: my, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: dotSize, height: dotSize, opacity: hovered ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-[#D0FD0A]"
      />
      <motion.div
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: 1,
          borderColor: hovered
            ? "rgba(208,253,10,0.5)"
            : "rgba(255,255,255,0.12)",
          backgroundColor: hovered
            ? "rgba(208,253,10,0.06)"
            : "rgba(255,255,255,0)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.3 }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border flex items-center justify-center backdrop-blur-[1px]"
      >
        {hovered && hoverLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="text-[7px] tracking-[0.15em] uppercase text-[#D0FD0A]/80 font-semibold whitespace-nowrap select-none"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {hoverLabel}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
