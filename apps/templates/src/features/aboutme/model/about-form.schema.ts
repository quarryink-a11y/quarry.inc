import { z } from "zod";

const aboutBlockSchema = z.object({
  title: z.string().max(120, "Title is too long"),
  text: z.string().max(500, "Text is too long"),
});

const aboutFormSchema = z.object({
  text: z
    .string()
    .trim()
    .min(200, "About text must be at least 200 characters")
    .max(1200, "About text is too long"),
  photo_url: z.string(),
  blocks: z.array(aboutBlockSchema).max(10, "Too many blocks"),
});

type AboutFormValues = z.infer<typeof aboutFormSchema>;

export { aboutFormSchema, type AboutFormValues };
