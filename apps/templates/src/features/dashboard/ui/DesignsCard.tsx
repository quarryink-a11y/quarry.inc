"use client";

import { useTenantHref } from "@shared/hooks/use-tenant-href";
import type { Design } from "@shared/types/api";
import Link from "next/link";

interface DesignsCardProps {
  items: Design[];
}

export function DesignsCard({ items }: DesignsCardProps) {
  const { href } = useTenantHref();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Designs</h3>
      </div>
      <div className="flex gap-2 mb-4 flex-1">
        {items.slice(0, 3).map((item, i) => (
          <div
            key={item.id || i}
            className="flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-gray-100"
          >
            <img
              src={
                item.image_url ||
                `https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=300&h=400&fit=crop&q=80&sig=${i}`
              }
              alt={item.name ?? ""}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <Link
        href={href("/admin/designs")}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl py-3 text-center transition-colors block"
      >
        + Add new
      </Link>
    </div>
  );
}
