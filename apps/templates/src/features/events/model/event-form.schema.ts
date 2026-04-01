import { z } from "zod";

const imageAttachmentSchema = z.object({
  image_url: z.string(),
  image_public_id: z.string(),
});

const eventFormSchema = z.object({
  city: z.string().trim().min(1, "City is required"),
  country: z.string().default(""),
  start_at: z.string().min(1, "Start date is required"),
  end_at: z.string().nullable().default(null),
  location: z.string().trim().min(1, "Location is required"),
  image: imageAttachmentSchema.nullable().default(null),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export { eventFormSchema, type EventFormValues };
