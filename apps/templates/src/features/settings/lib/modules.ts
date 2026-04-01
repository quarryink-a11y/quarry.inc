import { SiteSection } from "@shared/constants/enums";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, Palette, ShoppingBag, Star } from "lucide-react";

export interface ModuleDef {
  key: SiteSection;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const MODULES: ModuleDef[] = [
  {
    key: SiteSection.DESIGNS,
    label: "Designs",
    description: "Show your available tattoo designs for clients to browse",
    icon: Palette,
  },
  {
    key: SiteSection.CATALOG,
    label: "Catalog / Shop",
    description: "Sell merch, gift certificates, prints and more",
    icon: ShoppingBag,
  },
  {
    key: SiteSection.EVENTS,
    label: "Events",
    description: "Display upcoming guest spots, conventions and events",
    icon: CalendarDays,
  },
  {
    key: SiteSection.REVIEWS,
    label: "Reviews",
    description: "Show client testimonials and reviews on your site",
    icon: Star,
  },
];
