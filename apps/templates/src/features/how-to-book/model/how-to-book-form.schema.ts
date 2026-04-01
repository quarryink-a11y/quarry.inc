import { z } from "zod";

const bookingStepFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .regex(/^[^0-9]*$/, "Title must not contain numbers"),
  description: z.string().default(""),
});

type BookingStepFormValues = z.infer<typeof bookingStepFormSchema>;

export { bookingStepFormSchema, type BookingStepFormValues };
