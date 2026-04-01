import { faqKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DEFAULT_FAQ_CATEGORIES } from "../lib/default-faq";

export function useSeedDefaultFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      for (let i = 0; i < DEFAULT_FAQ_CATEGORIES.length; i++) {
        const cat = DEFAULT_FAQ_CATEGORIES[i];

        const { data: created, error } = await apiClient.POST(
          "/api/faq/categories",
          { body: { title: cat.title, sort_order: i + 1 } },
        );
        if (error || !created) continue;

        const categoryId = created.id;

        for (let j = 0; j < cat.questions.length; j++) {
          await apiClient.POST("/api/faq/items", {
            body: {
              category_id: categoryId,
              question: cat.questions[j],
              sort_order: j + 1,
            },
          });
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: faqKeys.categories() });
    },
  });
}
