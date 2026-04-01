import { ReferralSource } from "@shared/constants/enums";
import { z } from "zod";

const consultationFormSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  client_email: z.email("Invalid email"),
  client_phone: z.string().trim().min(1, "Phone number is required"),
  idea_description: z.string().trim().min(1, "Tattoo idea is required"),
  placement: z.array(z.string()).min(1, "Select at least one placement"),
  size_value: z.string().trim().min(1, "Size is required"),
  size_unit: z.string().min(1, "Size unit is required"),
  preferred_date: z.string().min(1, "Preferred date is required"),
  inspiration_urls: z.array(z.string()).min(1, "Add at least one inspiration"),
  city: z.string().min(1, "City is required"),
  referral_source: z.nativeEnum(ReferralSource),
});

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export { consultationFormSchema, type ConsultationFormValues };
