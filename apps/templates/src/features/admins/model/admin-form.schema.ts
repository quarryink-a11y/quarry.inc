import { z } from "zod";

export const MODULES = [
  "Portfolio",
  "Designs",
  "Events",
  "Reviews",
  "Contacts",
] as const;

export const adminModulesSchema = z.enum(MODULES);

export const adminFormSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().min(1, "Last name is required"),
    email: z.email("Invalid email"),
    phone_code: z.string().trim().min(1, "Phone code is required"),
    phone_country_code: z.string().trim().min(1, "Country code is required"),
    phone_number: z.string().trim().min(1, "Phone number is required"),
    password: z.string(),
    repeat_password: z.string(),
    access_modules: z.array(adminModulesSchema).default([]),
    isEdit: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.isEdit) {
      if (!data.password || data.password.length < 8) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password must be at least 8 characters",
        });
      }

      if (!data.repeat_password) {
        ctx.addIssue({
          code: "custom",
          path: ["repeat_password"],
          message: "Please repeat the password",
        });
      }

      if (data.password !== data.repeat_password) {
        ctx.addIssue({
          code: "custom",
          path: ["repeat_password"],
          message: "Passwords do not match",
        });
      }
    }
  });

export type AdminFormValues = z.infer<typeof adminFormSchema>;
export type AccessModule = (typeof MODULES)[number];
