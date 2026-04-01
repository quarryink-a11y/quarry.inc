"use client";

import { useOrders } from "@features/catalog/api";
import { Skeleton } from "@shared/components/ui/skeleton";
import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import type { Order } from "@shared/types/api";
import {
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

import { OrderCard } from "./OrderCard";

const STATUS_FILTERS = ["ALL", "PAID", "PENDING", "FAILED", "REFUNDED"];
const STATUS_LABELS: Record<string, string> = {
  ALL: "All",
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export function OrdersSection() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading } = useOrders();

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o: Order) => o.status === statusFilter);

  const stats = useMemo(() => {
    const paidOrders = orders.filter((o: Order) => o.status === "PAID");
    const totalRevenue = paidOrders.reduce(
      (sum: number, o: Order) => sum + Number(o.total_amount ?? 0),
      0,
    );
    const totalItems = paidOrders.reduce(
      (sum: number, o: Order) =>
        sum + o.items.reduce((s: number, i) => s + (i.quantity || 1), 0),
      0,
    );
    return {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      pendingOrders: orders.filter((o: Order) => o.status === "PENDING").length,
      totalRevenue,
      totalItems,
      currency: paidOrders[0]?.currency ?? "USD",
    };
  }, [orders]);

  const revenueSymbol =
    CURRENCY_SYMBOLS[stats.currency as keyof typeof CURRENCY_SYMBOLS] ?? "$";

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Orders</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {(
          [
            {
              label: "Total orders",
              value: stats.totalOrders,
              icon: ShoppingBag,
              color: "blue",
            },
            {
              label: "Revenue",
              value: `${revenueSymbol}${stats.totalRevenue.toFixed(2)}`,
              icon: DollarSign,
              color: "emerald",
            },
            {
              label: "Paid",
              value: stats.paidOrders,
              icon: TrendingUp,
              color: "green",
            },
            {
              label: "Pending",
              value: stats.pendingOrders,
              icon: Clock,
              color: "amber",
            },
          ] as const
        ).map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl bg-${color}-50 flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 text-${color}-500`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((s) => {
          const count =
            s === "all"
              ? orders.length
              : orders.filter((o: Order) => o.status === s).length;
          if (count === 0 && s !== "all") return null;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap font-medium ${
                statusFilter === s
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {STATUS_LABELS[s] ?? s}
              {count > 0 ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            {statusFilter === "all"
              ? "No orders yet"
              : `No ${(STATUS_LABELS[statusFilter] ?? statusFilter).toLowerCase()} orders`}
          </p>
          <p className="text-xs mt-1.5 text-gray-400 max-w-xs mx-auto">
            Orders will appear here once customers purchase from your site.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100/80">
          {filteredOrders.map((order: Order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
