"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";

interface FeatureCardProps {
  feature: {
    title: string;
    description: string;
    highlighted: boolean;
  };
  index: number;
}
export function FeatureCard({ feature, index }: FeatureCardProps) {
  const isHighlighted = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl border border-gray-200 p-6 md:p-8 overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isHighlighted
          ? "bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-transparent"
          : "bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Globe size={18} className="text-gray-600" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-gray-900 leading-snug">
            {feature.title}
          </h4>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
