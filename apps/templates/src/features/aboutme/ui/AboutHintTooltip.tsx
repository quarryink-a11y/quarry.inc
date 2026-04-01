"use client";

import { HelpCircle, X } from "lucide-react";
import { useState } from "react";

import { EXAMPLE_TEXT, PREVIEW_IMAGE } from "../lib/example-content";

export function AboutHintTooltip() {
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5 animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-900">
                Example of &quot;About me&quot;
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={PREVIEW_IMAGE}
              alt="About section preview"
              className="w-full rounded-xl mb-4 border border-gray-100"
            />
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-2">
                Example text:
              </p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {EXAMPLE_TEXT}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              This is how the &quot;About me&quot; section will look on your
              website
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
