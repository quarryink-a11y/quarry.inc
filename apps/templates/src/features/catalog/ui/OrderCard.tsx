"use client";

import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import type { Order } from "@shared/types/api";
import { format } from "date-fns";
import { ChevronDown, Mail, ShoppingBag, User } from "lucide-react";
import { useState } from "react";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> =
  {
    PAID: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      dot: "bg-amber-500",
    },
    FAILED: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
    REFUNDED: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      dot: "bg-gray-400",
    },
  };

const STATUS_LABELS: Record<string, string> = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const symbol =
    CURRENCY_SYMBOLS[order.currency as keyof typeof CURRENCY_SYMBOLS] ?? "$";
  const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.REFUNDED;
  const itemCount = order.items.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <div
      className="px-5 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer select-none"
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[15px] font-bold text-gray-900 tabular-nums">
            {symbol}
            {order.total_amount}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
          {itemCount > 0 && (
            <span className="text-[11px] text-gray-400 hidden sm:inline">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400 tabular-nums">
            {order.created_at
              ? format(new Date(order.created_at), "MMM d, yyyy")
              : ""}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
        <User className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="truncate">{order.customer_name || "Unknown"}</span>
        {order.customer_email && (
          <>
            <span className="text-gray-300">&middot;</span>
            <Mail className="w-3 h-3 text-gray-300 shrink-0 hidden sm:block" />
            <span className="text-gray-400 truncate hidden sm:inline">
              {order.customer_email}
            </span>
          </>
        )}
      </div>

      {expanded && order.items.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <span className="text-gray-700 truncate">{item.name}</span>
                <span className="text-gray-300 text-xs">
                  &times;{item.quantity || 1}
                </span>
              </div>
              <span className="text-gray-900 font-medium tabular-nums text-xs shrink-0">
                {CURRENCY_SYMBOLS[
                  item.currency as keyof typeof CURRENCY_SYMBOLS
                ] ?? symbol}
                {(item.price * (item.quantity || 1)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
