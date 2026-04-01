import { z } from "zod";

const faqQuestionFormSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(200),
  answer: z.string().max(2000),
});

type FaqQuestionFormValues = z.infer<typeof faqQuestionFormSchema>;

export { faqQuestionFormSchema, type FaqQuestionFormValues };
