"use client";

import {
  EXAMPLE_STEPS,
  HOW_TO_BOOK_PREVIEW_IMAGE,
} from "@features/how-to-book/lib/example-steps";
import { HelpCircle, X } from "lucide-react";
import { useState } from "react";

export function HowToBookHintTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 transition-all"
      >
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30 animate-ping" />
          <HelpCircle className="relative w-3.5 h-3.5 text-blue-500" />
        </span>
        <span className="text-[11px] font-medium text-blue-600">
          See example
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-900">
                Example of &quot;How to Book&quot;
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={HOW_TO_BOOK_PREVIEW_IMAGE}
              alt="How to book preview"
              className="w-full rounded-xl mb-4 border border-gray-100"
            />
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-medium">
                Example steps:
              </p>
              {EXAMPLE_STEPS.map((step, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed pl-8">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              This is how the &quot;How to Book&quot; section will look on your
              website
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
