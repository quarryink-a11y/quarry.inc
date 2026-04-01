export { BentoAboutSection } from "./BentoAboutSection";
export { BentoContactSection } from "./BentoContactSection";
export { BentoCursor } from "./BentoCursor";
export { BentoDesignsSection } from "./BentoDesignsSection";
export { BentoEventsSection } from "./BentoEventsSection";
export { BentoFaqSection } from "./BentoFaqSection";
export { BentoFluidCanvas } from "./BentoFluidCanvas";
export { BentoHeroSection } from "./BentoHeroSection";
export { BentoHowToBookSection } from "./BentoHowToBookSection";
export { BentoPortfolioSection } from "./BentoPortfolioSection";
export { BentoReviewsSection } from "./BentoReviewsSection";
export { BentoShopSection } from "./BentoShopSection";

import type { TemplateAppProps } from "@shared/components/tenant-templates/registry";

import { Template2Layout } from "./layout";
import { Template2Page } from "./page";

export function Template2App({ content, isPreview }: TemplateAppProps) {
  return (
    <Template2Layout>
      <Template2Page content={content} isPreview={isPreview} />
    </Template2Layout>
  );
}
