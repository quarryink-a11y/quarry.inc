"use client";

import type { Currency } from "@shared/constants/enums";
import { CURRENCY_SYMBOLS } from "@shared/constants/mappers";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ShopProduct {
  id?: string | number;
  name: string;
  price_num: number;
  price?: string;
  currency: Currency | string;
  category?: string;
  img?: string;
  description?: string;
  gift_amounts?: number[];
  sold_out?: boolean;
}

interface ShopProductModalProps {
  product: ShopProduct | null;
  open: boolean;
  onClose: () => void;
  onBuy: (product: ShopProduct) => void;
  buying: boolean;
  stripeConnected?: boolean;
  isPreview?: boolean;
}

export function ShopProductModal({
  product,
  open,
  onClose,
  onBuy,
  buying,
  stripeConnected,
  isPreview,
}: ShopProductModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const isGiftCert = product?.category === "Gift Certificate";
  const giftAmounts = product?.gift_amounts || [];
  const hasAmountOptions = isGiftCert && giftAmounts.length > 0;
  const minAmount = hasAmountOptions ? Math.min(...giftAmounts) : 0;

  useEffect(() => {
    if (!open || !product) return;
    const isGift = product.category === "Gift Certificate";
    const amounts = product.gift_amounts ?? [];
    if (isGift && amounts.length > 0) {
      const timeout = setTimeout(() => {
        setSelectedAmount(amounts[0]);
        setCustomAmount("");
        setUseCustom(false);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [open, product]);

  if (!product) return null;

  const symbol = CURRENCY_SYMBOLS[product.currency as Currency] || "$";

  const getFinalPrice = (): number | null => {
    if (!hasAmountOptions) return product.price_num;
    if (useCustom) {
      const val = Number(customAmount);
      return val >= minAmount ? val : null;
    }
    return selectedAmount;
  };

  const finalPrice = getFinalPrice();
  const canBuy = finalPrice !== null && finalPrice > 0;

  const handleBuy = () => {
    if (!canBuy || !finalPrice) return;
    onBuy({ ...product, price_num: finalPrice });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ cursor: "default" }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{ cursor: "default" }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              style={{ cursor: "pointer" }}
            >
              <X className="w-5 h-5 text-white/80" />
            </button>

            {product.img && (
              <div className="w-full aspect-[4/3] overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-light text-white/90">
                    {product.name}
                  </h3>
                  {!hasAmountOptions && (
                    <span className="text-sm text-white/40 shrink-0">
                      {symbol}
                      {product.price_num}
                    </span>
                  )}
                </div>
                {product.category && (
                  <p className="text-[10px] tracking-[0.15em] uppercase text-white/25 mt-1">
                    {product.category}
                  </p>
                )}
              </div>

              {product.description && (
                <p className="text-[13px] leading-relaxed text-white/50 font-light whitespace-pre-line">
                  {product.description}
                </p>
              )}

              {hasAmountOptions && (
                <div className="space-y-3">
                  <p className="text-[11px] tracking-[0.1em] uppercase text-white/40">
                    Select amount
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {giftAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => {
                          setSelectedAmount(amt);
                          setUseCustom(false);
                        }}
                        className={`px-4 py-2 text-sm border transition-all duration-200 ${
                          !useCustom && selectedAmount === amt
                            ? "border-white/40 text-white bg-white/10"
                            : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/70"
                        }`}
                      >
                        {symbol}
                        {amt}
                      </button>
                    ))}
                    <button
                      onClick={() => setUseCustom(true)}
                      className={`px-4 py-2 text-sm border transition-all duration-200 ${
                        useCustom
                          ? "border-white/40 text-white bg-white/10"
                          : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/70"
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                  {useCustom && (
                    <div className="space-y-1">
                      <input
                        type="number"
                        min={minAmount}
                        step="1"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder={`Min ${symbol}${minAmount}`}
                        className="w-full bg-transparent border border-white/15 text-white/80 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/20"
                        style={{ cursor: "text" }}
                      />
                      {customAmount && Number(customAmount) < minAmount && (
                        <p className="text-[11px] text-red-400/70">
                          Minimum amount is {symbol}
                          {minAmount}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {product.sold_out ? (
                <div className="w-full py-3 text-[10px] tracking-[0.2em] uppercase text-white/25 border border-white/5 text-center">
                  Sold out
                </div>
              ) : stripeConnected && !isPreview ? (
                <button
                  onClick={handleBuy}
                  disabled={buying || !canBuy}
                  className="w-full py-3 text-[10px] tracking-[0.2em] uppercase text-white/80 border border-white/15 hover:border-white/40 hover:text-white transition-all duration-300 hover:bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ cursor: canBuy && !buying ? "pointer" : undefined }}
                >
                  {buying ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Processing...
                    </span>
                  ) : hasAmountOptions && canBuy ? (
                    `Buy — ${symbol}${finalPrice}`
                  ) : (
                    "Buy now"
                  )}
                </button>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
