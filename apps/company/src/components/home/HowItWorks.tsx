"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const PHONE_IMAGE =
  "https://media.base44.com/images/public/69b03f938ed1d3967eceb51f/452077831_generated_67bb94ac.png";

const STEPS = [
  {
    number: "1",
    title: "Pick a design that matches your aesthetic",
    description:
      "Each website template is designed specifically for tattoo artists and built on today's best web design standards.",
  },
  {
    number: "2",
    title: "Fill out the brief",
    description:
      "Share your workflow, services, and artistic background. We instantly turn this into the structure and content of your website.",
  },
  {
    number: "3",
    title: "Get & manage your website today",
    description:
      "Update your portfolio, prices, reviews, flashes, and guest spots — all from one simple dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 100% at 50% 0%, #2d40d8 0%, #1a2ab0 35%, #0e1a6e 65%, #080d3a 100%)",
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(2.5rem,9vw,7.5rem)] leading-[1] font-light text-white tracking-tight mb-10"
        >
          How It Works. <span className="text-white/30">—</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[22px] text-white/50 leading-[1.4] max-w-sm font-light"
            >
              A simple workflow that lets tattoo artists{" "}
              <span className="text-white font-medium underline decoration-white/30 underline-offset-2">
                launch their website and manage their business
              </span>{" "}
              with zero tech skills.
            </motion.p>

            <div className="mt-12 space-y-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex gap-5"
                >
                  {/* Vertical line */}
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className="w-[3px] rounded-full"
                      style={{
                        height: "100%",
                        minHeight: "70px",
                        background:
                          i === 0
                            ? "rgba(255,255,255,0.8)"
                            : i === 1
                              ? "rgba(255,255,255,0.4)"
                              : "rgba(255,255,255,0.2)",
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      {step.number}.{step.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/40 leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12"
            >
              <Button
                variant="outline"
                className="rounded-full px-10 py-6 text-base text-black bg-white hover:bg-gray-100 border-0 font-normal"
              >
                Start Now
              </Button>
            </motion.div>
          </div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-[260px] md:w-[300px] lg:w-[340px]">
              <img
                src={PHONE_IMAGE}
                alt="Phone mockup"
                className="w-full h-auto drop-shadow-2xl"
                style={{
                  borderRadius: "2.8rem",
                  boxShadow:
                    "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
