"use client";

import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    duration: 1,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    delay,
  },
  viewport: { once: true },
});

const inputClass =
  "w-full bg-transparent border border-white/[0.07] px-5 py-4 text-white text-[13px] font-light focus:outline-none focus:border-white/20 transition-colors duration-500 placeholder:text-white/20";

export function BookingFormSection() {
  return (
    <section className="bg-[#050505] py-28 md:py-36 px-6 md:px-16">
      <div className="max-w-2xl mx-auto">
        <motion.p className="section-title mb-6" {...fadeUp()}>
          Get in touch
        </motion.p>
        <motion.h2
          className="font-serif-display text-[40px] md:text-[48px] font-light text-white leading-[1.2] mb-14"
          {...fadeUp(0.1)}
        >
          Book a consultation
        </motion.h2>

        <motion.div className="space-y-4" {...fadeUp(0.2)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-caps text-white/35 mb-2.5 block">
                First name
              </label>
              <input className={inputClass} placeholder="John" />
            </div>
            <div>
              <label className="label-caps text-white/35 mb-2.5 block">
                Last name
              </label>
              <input className={inputClass} placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="label-caps text-white/35 mb-2.5 block">
              Email
            </label>
            <input className={inputClass} placeholder="john@example.com" />
          </div>
          <div>
            <label className="label-caps text-white/35 mb-2.5 block">
              Describe your tattoo idea
            </label>
            <textarea
              className={`${inputClass} h-32 resize-none`}
              placeholder="Tell me about your idea..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-caps text-white/35 mb-2.5 block">
                Body placement
              </label>
              <select className={`${inputClass} text-white/40 appearance-none`}>
                <option>Forearm</option>
                <option>Upper arm</option>
                <option>Back</option>
                <option>Chest</option>
              </select>
            </div>
            <div>
              <label className="label-caps text-white/35 mb-2.5 block">
                Approximate size
              </label>
              <input className={inputClass} placeholder="e.g. 15 cm" />
            </div>
          </div>
          <button className="w-full mt-6 px-8 py-4 bg-white text-[#050505] text-[9px] tracking-[0.42em] uppercase font-light hover:bg-white/90 transition-colors duration-500">
            Send request
          </button>
        </motion.div>
      </div>
    </section>
  );
}
