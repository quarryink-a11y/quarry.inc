import type { ConsultationFormValues } from "@features/consultation/model";
import { apiClient } from "@shared/lib/api-client";
import { useMutation } from "@tanstack/react-query";

import { useRequiredTenant } from "@/shared/providers/TenantProvider";

export function useSubmitInquiry() {
  const tenant = useRequiredTenant();
  const tenantHost = tenant.site_domain?.host ?? window.location.hostname;

  return useMutation({
    mutationFn: async (values: ConsultationFormValues) => {
      const { error } = await apiClient.POST("/api/public/inquiries", {
        body: {
          ...values,
          placement: values.placement.join(", "),
        },
        headers: {
          "x-forwarded-host": tenantHost,
        },
      });

      if (error) throw new Error("Failed to submit inquiry");
    },
  });
}
