"use client";

import type { CatalogCategory } from "@shared/constants/enums";
import {
  CATALOG_CATEGORY_LABELS,
  CURRENCY_SYMBOLS,
} from "@shared/constants/mappers";
import type { Catalog } from "@shared/types/api";
import { motion } from "framer-motion";
import { Loader2, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { ShopProductModal } from "./ShopProductModal";

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

interface ShopSectionProps {
  items?: Catalog[];
  stripeConnected?: boolean;
  isPreview?: boolean;
  tenantHost?: string;
}

export function ShopSection({
  items,
  stripeConnected,
  isPreview,
  tenantHost,
}: ShopSectionProps) {
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
      if (data?.url) {
        window.location.assign(data.url);
      }
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <section id="shop" className="bg-[#050505] py-12 md:py-20 px-6 md:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="label-caps text-white/35 mb-16"
        >
          Shop
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
          {products.map((p, i) => (
            <motion.div
              key={i}
              className="group cursor-pointer bg-[#050505]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              viewport={{ once: true }}
              onClick={() => setSelectedProduct(p)}
            >
              <div className="overflow-hidden relative">
                {p.img && (
                  <>
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
                  </>
                )}
                {stripeConnected && !isPreview && !p.sold_out && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleBuy(p);
                      }}
                      disabled={buyingId === p.id}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    >
                      {buyingId === p.id ? (
                        <Loader2 className="w-3.5 h-3.5 text-[#050505] animate-spin" />
                      ) : (
                        <ShoppingBag className="w-3.5 h-3.5 text-[#050505]" />
                      )}
                    </button>
                  </div>
                )}
                {p.sold_out && (
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] tracking-[0.15em] uppercase bg-black/60 backdrop-blur-sm text-white/70 px-2.5 py-1">
                      Sold out
                    </span>
                  </div>
                )}
              </div>
              <div className="px-3 py-4 bg-[#0a0a0a]">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-serif-display text-[16px] font-light text-white/70">
                    {p.name}
                  </p>
                  <p className="label-caps text-white/25 shrink-0">{p.price}</p>
                </div>
                {p.category && (
                  <p className="text-[10px] leading-[1.9] text-white/30 font-light mt-1">
                    {CATALOG_CATEGORY_LABELS[p.category as CatalogCategory] ??
                      p.category}
                  </p>
                )}
                {stripeConnected &&
                  !isPreview &&
                  (p.sold_out ? (
                    <div className="mt-3 w-full py-2 text-[10px] tracking-[0.2em] uppercase text-white/25 border border-white/5 text-center">
                      Sold out
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleBuy(p);
                      }}
                      disabled={buyingId === p.id}
                      className="mt-3 w-full py-2 text-[10px] tracking-[0.2em] uppercase text-white/60 border border-white/10 hover:border-white/30 hover:text-white/90 transition-all duration-300"
                    >
                      {buyingId === p.id ? "Processing..." : "Buy now"}
                    </button>
                  ))}
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
      </div>
    </section>
  );
}
