"use client";

import { SiteSection } from "@shared/constants/enums";
import { useSiteMe } from "@shared/hooks/use-site";
import { apiClient } from "@shared/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const ESSENTIAL_MODULES: SiteSection[] = [
  SiteSection.ARTIST_PROFILE,
  SiteSection.ABOUT,
  SiteSection.HOW_TO_BOOK,
  SiteSection.PORTFOLIO,
  SiteSection.FAQ,
];

export const OPTIONAL_MODULES: SiteSection[] = [
  SiteSection.DESIGNS,
  SiteSection.CATALOG,
  SiteSection.EVENTS,
  SiteSection.REVIEWS,
  SiteSection.WELCOME,
  SiteSection.ORDERS,
  SiteSection.ANALYTICS,
];

export const ALL_MODULES: SiteSection[] = [
  ...ESSENTIAL_MODULES,
  ...OPTIONAL_MODULES,
];

export function useCompleteModule() {
  const queryClient = useQueryClient();
  const { data: site } = useSiteMe();

  const mutation = useMutation({
    mutationFn: async (module: SiteSection) => {
      const { data, error } = await apiClient.POST(
        "/api/sites/complete-module",
        {
          body: { module },
        },
      );
      if (error || !data) throw new Error("Failed to complete module");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sites", "me"] });
    },
  });

  /**
   * Completes a module if not already completed.
   * Returns `true` if the module was newly completed, `false` if already done.
   */
  const completeModule = async (moduleKey: SiteSection): Promise<boolean> => {
    if (site?.completed_modules?.includes(moduleKey)) {
      return false;
    }
    await mutation.mutateAsync(moduleKey);
    return true;
  };

  return { completeModule };
}
