"use client";

import { useLocalStorage } from "@quarry/shared-hooks";
import { X } from "lucide-react";

export function WelcomeBanner() {
  const [visible, setVisible] = useLocalStorage("welcome_banner_visible", true);
  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
      >
        <X className="w-3.5 h-3.5 text-gray-500" />
      </button>

      <p className="text-gray-600 leading-relaxed mb-4 pr-6">
        Great to have you on board. We&apos;ve got plenty of awesome features
        coming to boost your workflow, but first here&apos;s the basics.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        This is your admin panel. Here, you&apos;re in full control of your
        website: add new portfolio, update events and prices, manage flash
        designs, and more. All by yourself, and just in a few clicks.
      </p>
      <div className="bg-blue-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium mb-5 inline-block">
        OPEN THE MODULE → UPDATE THE IMAGE OR DESCRIPTION → SAVE IT = DONE 🎉
      </div>

      <div>
        <button
          onClick={handleDismiss}
          className="bg-gray-900 text-white rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Got it 👍
        </button>
      </div>
    </div>
  );
}
