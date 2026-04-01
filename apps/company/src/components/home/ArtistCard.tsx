"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ArtistCardProps {
  artist: {
    name: string;
    specialty: string;
    image: string;
  };
  index: number;
}
export function ArtistCard({ artist, index }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex-shrink-0 w-[280px] md:w-[320px]"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-base font-medium text-gray-900">{artist.name}</p>
          <p className="text-sm text-gray-500 mt-1">{artist.specialty}</p>
        </div>
        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
          <ArrowUpRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
