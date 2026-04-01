import { z } from "zod";

export const bookingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  idea: z.string().min(1, "Tattoo idea is required"),
  placement: z.array(z.string()).min(1, "Select at least one placement"),
  sizeValue: z.string().min(1, "Size is required"),
  sizeUnit: z.string().min(1, "Unit is required"),
  date: z.string().min(1, "Date is required"),
  inspirationUrls: z.array(z.string()).default([]),
  city: z.string().default(""),
  referralSource: z.string().min(1, "Please select how you found us"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(1, "Phone is required"),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
