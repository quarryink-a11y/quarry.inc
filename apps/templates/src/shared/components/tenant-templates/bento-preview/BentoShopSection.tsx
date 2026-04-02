"use client";

import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import type { Catalog } from "@shared/types/api";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { ShopProductModal } from "../template-preview/ShopProductModal";
const FONT = "'Manrope', sans-serif";

interface DisplayProduct {
  id?: string | number;
  name: string;
  price_num: number;
  price: string;
  currency: string;
  category: string;
  img?: string;
  description: string;
  gift_amounts: number[];
  sold_out: boolean;
}

interface BentoShopSectionProps {
  items?: Catalog[];
  isPreview?: boolean;
  stripeConnected?: boolean;
  tenantHost?: string;
}

export function BentoShopSection({
  items,
  isPreview,
  stripeConnected,
  tenantHost,
}: BentoShopSectionProps) {
  const [buyingId, setBuyingId] = useState<string | number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<DisplayProduct | null>(
    null,
  );

  if (!items?.length) return null;

  const products: DisplayProduct[] = items.map((p) => ({
    id: p.id,
    name: p.name,
    price_num: p.price,
    price: `${CURRENCY_SYMBOLS[p.currency as keyof typeof CURRENCY_SYMBOLS] ?? "$"}${p.price}`,
    currency: p.currency ?? "USD",
    category: p.category ?? "",
    img: p.image_url,
    description: p.description ?? "",
    gift_amounts: p.gift_amounts ?? [],
    sold_out:
      p.stock_quantity !== null &&
      p.stock_quantity !== undefined &&
      p.stock_quantity <= 0,
  }));

  const handleBuy = async (product: DisplayProduct) => {
    if (isPreview || !stripeConnected) return;
    setBuyingId(product.id ?? null);
    try {
      const currentUrl = window.location.href.split("?")[0];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/public/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-host": tenantHost ?? window.location.hostname,
          "x-forwarded-host": tenantHost ?? window.location.hostname,
        },
        body: JSON.stringify({
          items: [
            {
              id: String(product.id),
              quantity: 1,
              ...(product.gift_amounts?.length
                ? { price: Number(product.price_num) }
                : {}),
            },
          ],
          success_url: `${currentUrl}?payment=success`,
          cancel_url: `${currentUrl}?payment=cancelled`,
        }),
      });
      const data = (await res.json()) as { url: string };
      if (data?.url) window.location.assign(data.url);
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <section
      id="shop"
      className="bg-black py-6 px-4 md:px-8"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[#141414] rounded-[20px] p-6 md:p-8"
        >
          <span className="inline-flex items-center text-[10px] tracking-[0.15em] uppercase text-black bg-[#D0FD0A] px-3 py-1.5 rounded-full mb-6 font-medium">
            Shop
          </span>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map((p, i) => (
              <motion.div
                key={i}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                viewport={{ once: true }}
                onClick={() => setSelectedProduct(p)}
              >
                <div className="rounded-[14px] overflow-hidden bg-[#1e1e1e]">
                  <div className="overflow-hidden relative">
                    {p.img && (
                      <>
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full aspect-square object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                        {p.sold_out && (
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] tracking-[0.1em] uppercase bg-black/60 text-white/60 px-2 py-1 rounded-full">
                              Sold out
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[16px] font-regular text-white/80 truncate">
                      {p.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] text-white/30 font-medium">
                        {p.category}
                      </p>
                      <p className="text-[16px] text-[#D0FD0A]/70 font-medium">
                        {p.price}
                      </p>
                    </div>
                    {stripeConnected &&
                      !isPreview &&
                      (p.sold_out ? (
                        <div className="mt-2.5 w-full py-2 text-[10px] tracking-[0.1em] uppercase text-white/20 border border-white/5 rounded-lg text-center">
                          Sold out
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleBuy(p);
                          }}
                          disabled={buyingId === p.id}
                          className="mt-2.5 w-full py-2 text-[10px] tracking-[0.1em] uppercase text-black bg-[#D0FD0A] hover:bg-[#d4ff33] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          {buyingId === p.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : null}
                          {buyingId === p.id ? "Processing..." : "Buy now"}
                        </button>
                      ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <ShopProductModal
            product={selectedProduct}
            open={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onBuy={(p) => {
              setSelectedProduct(null);
              void handleBuy(p as DisplayProduct);
            }}
            buying={buyingId === selectedProduct?.id}
            stripeConnected={stripeConnected}
            isPreview={isPreview}
          />
        </motion.div>
      </div>
    </section>
  );
}
