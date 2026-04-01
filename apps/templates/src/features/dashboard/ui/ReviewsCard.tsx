"use client";

import { useTenantHref } from "@shared/hooks/use-tenant-href";
import type { Review } from "@shared/types/api";
import { Plus } from "lucide-react";
import Link from "next/link";

interface ReviewsCardProps {
  reviews: Review[];
}

export function ReviewsCard({ reviews }: ReviewsCardProps) {
  const { href } = useTenantHref();
  const review = reviews[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Reviews</h3>
        <Link
          href={href("/admin/reviews")}
          className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        </Link>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-2">
          {review.created_at
            ? new Date(review.created_at)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, ".")
            : ""}
        </p>
        <p className="font-semibold text-gray-800 text-sm mb-2">
          {review.client_name || "User Name"}
        </p>
        <p className="text-gray-500 text-sm leading-relaxed">
          &ldquo;{review.review_text}&rdquo;
        </p>
      </div>
    </div>
  );
}
