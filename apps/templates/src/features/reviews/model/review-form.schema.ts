import { z } from "zod";

const imageAttachmentSchema = z.object({
  image_url: z.string(),
  image_public_id: z.string(),
});

const reviewFormSchema = z.object({
  client_name: z.string().trim().min(1, "Client name is required"),
  review_source: z.string().min(1, "Review source is required"),
  client_profile_url: z.url("Invalid URL").optional(),
  client_image: imageAttachmentSchema.nullable(),
  review_text: z.string().trim().min(1, "Review text is required").max(500),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export { reviewFormSchema, type ReviewFormValues };
