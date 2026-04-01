// TODO: Separate into multiple files if it grows too large

export { AboutSection } from "./AboutSection";
export { BookingFormModal } from "./BookingFormModal";
export { BookingFormSection } from "./BookingFormSection";
export { ContactSection } from "./ContactSection";
export { CustomCursor } from "./CustomCursor";
export { DesignsSection } from "./DesignsSection";
export { EventsSection } from "./EventsSection";
export { FaqSection } from "./FaqSection";
export { FluidCanvas } from "./FluidCanvas";
export { HeroSection } from "./HeroSection";
export { HowToBookSection } from "./HowToBookSection";
export { MobileMenu } from "./MobileMenu";
export { PortfolioSection } from "./PortfolioSection";
export { ReviewsSection } from "./ReviewsSection";
export { ShopProductModal } from "./ShopProductModal";
export { ShopSection } from "./ShopSection";

import type { TemplateAppProps } from "@shared/components/tenant-templates/registry";

import { Template1Layout } from "./layout";
import { Template1Page } from "./page";

export function Template1App({ content, isPreview }: TemplateAppProps) {
  return (
    <Template1Layout>
      <Template1Page content={content} isPreview={isPreview} />
    </Template1Layout>
  );
}
