import type { components } from "@quarry/api-types";
import type { PublicSiteContent } from "@shared/types/api";
import type { Metadata } from "next";

export interface TemplateAppProps {
  content?: PublicSiteContent | null;
  isPreview?: boolean;
}

export const templateRegistry: Record<
  NonNullable<components["schemas"]["SiteResponseDto"]["template_kind"]>,
  {
    load: () => Promise<React.ComponentType<TemplateAppProps>>;
    metadata: Metadata;
  }
> = {
  TEMPLATE1: {
    load: async () =>
      (
        await import("@shared/components/tenant-templates/template-preview/index")
      ).Template1App,
    metadata: {
      title: "Template 1",
      description: "This is the description of Template 1",
    },
  },
  TEMPLATE2: {
    load: async () =>
      (await import("@shared/components/tenant-templates/bento-preview/index"))
        .Template2App,
    metadata: {
      title: "Template 2",
      description: "This is the description of Template 2",
    },
  },
};
