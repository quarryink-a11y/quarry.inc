import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url("Must be a valid URL")]);

export const contactFormSchema = z
  .object({
    artist_full_name: z
      .string()
      .trim()
      .min(1, "Artist name is required")
      .max(30, "Maximum 30 characters")
      .refine((value) => !/\d/.test(value), "Name must not contain digits"),

    short_description: z
      .string()
      .trim()
      .min(1, "Short description is required")
      .max(150, "Maximum 150 characters"),

    profile_image_url: z.string().optional().or(z.literal("")),

    country: z.string().trim().min(1, "Country is required"),
    city: z.string().trim().min(1, "City is required"),

    studio_name: z.string().trim().min(1, "Studio name is required"),
    studio_address: z.string().trim().min(1, "Studio address is required"),

    email: z.email("Invalid email").trim(),

    phone_code: z.string().optional().or(z.literal("")),
    phone_country_id: z.string().optional().or(z.literal("")),
    phone_number: z.string().trim().min(1, "Phone number is required"),

    instagram: z.url("Must be a valid URL"),
    telegram: optionalUrl,
    whatsapp: optionalUrl,
    tiktok: optionalUrl,
    facebook: optionalUrl,
    youtube: optionalUrl,

    image_url: z.string().or(z.literal("")),
  })
  .refine(
    (data) => {
      const socials = [
        data.instagram,
        data.telegram,
        data.whatsapp,
        data.tiktok,
        data.facebook,
        data.youtube,
      ];
      return socials.some((s) => !!s?.trim());
    },
    { message: "At least one social link is required", path: ["instagram"] },
  );

export type ContactFormValues = z.infer<typeof contactFormSchema>;
