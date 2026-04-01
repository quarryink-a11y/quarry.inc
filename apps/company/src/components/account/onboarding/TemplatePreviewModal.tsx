import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const sectionLabels = {
  hero: "Hero",
  about: "About",
  how_to_book: "How to Book",
  portfolio: "Portfolio",
  designs: "Designs",
  catalog: "Shop / Catalog",
  events: "Events",
  reviews: "Reviews",
  faq: "FAQ",
  booking_form: "Booking Form",
};

interface TemplatePreviewModalProps {
  template: {
    id: string;
    name: string;
    description: string;
    preview_image: string;
    preview_screens?: string[];
    sections: string[];
  };
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export function TemplatePreviewModal({
  template,
  onClose,
  onSelect,
}: TemplatePreviewModalProps) {
  const allImages = [
    template.preview_image,
    ...(template.preview_screens ?? []),
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % allImages.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
            <p className="text-sm text-gray-500">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview image + screenshots */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Main image with arrows */}
          <div className="relative rounded-xl overflow-hidden mb-3 bg-gray-950 group max-h-[50vh]">
            <img
              src={allImages[activeIndex]}
              alt={template.name}
              className="w-full h-full object-contain max-h-[50vh]"
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {allImages.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`flex-shrink-0 w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex ? "border-blue-500" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={url}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Live preview link */}
          <Link
            href={`/template-preview?templateId=${template.id}`}
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition mb-4"
          >
            <ExternalLink className="w-4 h-4" />
            Open live preview
          </Link>

          {/* Sections info */}
          <p className="text-xs text-gray-500 mb-2 font-medium">
            Included sections:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {template.sections.map((s) => (
              <span
                key={s}
                className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg"
              >
                {sectionLabels[s.toLowerCase() as keyof typeof sectionLabels] ||
                  s}
              </span>
            ))}
          </div>

          <Button
            onClick={() => {
              onSelect(template.id);
              onClose();
            }}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Use This Template
          </Button>
        </div>
      </div>
    </div>
  );
}
