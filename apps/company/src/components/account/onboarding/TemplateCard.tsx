import type { OnboardingTemplate } from "@quarry/api-types";
import { Check, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

interface TemplateCardProps {
  template: OnboardingTemplate;
  isSelected: boolean;
  onSelect: (templateId: string | null) => void;
  onPreview: (template: TemplateCardProps["template"]) => void;
}
export function TemplateCard({
  template,
  isSelected,
  onSelect,
  onPreview,
}: TemplateCardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col justify-start ${
        isSelected
          ? "border-blue-500 shadow-lg shadow-blue-100"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md"
      }`}
    >
      {template.is_popular && (
        <Badge className="bg-orange-100 text-orange-700 text-xs right-2 z-10 absolute top-4">
          Popular
        </Badge>
      )}
      {/* Preview Image */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden group">
        <img
          src={template.preview_image ?? ""}
          alt={template.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onPreview(template)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>
      {/* Preview screens */}
      {/* <div className="">
        {template.preview_screens.length > 0 && (
          <div className="flex space-x-1 overflow-x-auto p-2">
            {template.preview_screens.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${template.name} preview ${idx + 1}`}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />
            ))}
          </div>
        )}
      </div> */}
      {/* Info */}
      <div className="p-5 flex flex-col grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">
            {template.name}
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-4 min-h-[70px] grow">
          {template.description}
        </p>

        {/* Sections */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {template.sections.map((s) => (
            <span
              key={s}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
            >
              {sectionLabels[s.toLowerCase() as keyof typeof sectionLabels] ||
                s}
            </span>
          ))}
        </div>

        <Button
          onClick={() => onSelect(isSelected ? null : template.id)}
          className={`w-full cursor-pointer ${isSelected ? "bg-blue-500 hover:bg-blue-600" : ""}`}
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4 mr-1" /> Selected
            </>
          ) : (
            "Select Template"
          )}
        </Button>
      </div>
    </div>
  );
}
