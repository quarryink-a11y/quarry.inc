import { BodyPlacement } from "@shared/constants/enums";
import { z } from "zod";

const PLACEMENTS = Object.values(BodyPlacement);

const imageAttachmentSchema = z.object({
  image_url: z.string(),
  image_public_id: z.string(),
});

const optionalNumber = z
  .string()
  .default("")
  .transform((v) => (v === "" ? undefined : parseFloat(v)));

const currencyValues = ["USD", "CAD", "EUR", "UAH"] as const;

const formSchema = z.object({
  name: z.string().default(""),
  price: optionalNumber,
  currency: z.enum(currencyValues).default("USD"),
  size: optionalNumber,
  size_unit: z.enum(["CM", "INCH"]).default("CM"),
  preferred_body_placement: z.array(z.string()).default([]),
  image: imageAttachmentSchema.nullable().default(null),
});

type DesignFormValues = z.infer<typeof formSchema>;
type DesignFormInput = z.input<typeof formSchema>;

export { type DesignFormInput, type DesignFormValues, formSchema, PLACEMENTS };
