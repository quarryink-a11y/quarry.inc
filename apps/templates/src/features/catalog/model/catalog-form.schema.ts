import { CatalogCategory, Currency } from "@shared/constants/enums";
import { z } from "zod";

const imageAttachmentSchema = z.object({
  image_url: z.string(),
  image_public_id: z.string(),
});

const optionalInt = z
  .string()
  .default("")
  .transform((v) => (v === "" ? null : Math.max(0, Math.round(Number(v)))));

const currencyValues = Object.values(Currency) as [Currency, ...Currency[]];
const categoryValues = Object.values(CatalogCategory) as [
  CatalogCategory,
  ...CatalogCategory[],
];

const catalogFormSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().default(""),
  price: z
    .string()
    .min(1, "Price is required")
    .transform((v) => Number(v))
    .pipe(z.number().positive("Price must be greater than 0")),
  currency: z.enum(currencyValues).default(Currency.USD),
  category: z.enum(categoryValues).default(CatalogCategory.OTHER),
  image: imageAttachmentSchema.nullable().default(null),
  is_active: z.boolean().default(true),
  limited_stock: z.boolean().default(false),
  stock_quantity: optionalInt,
  gift_amounts: z.array(z.number()).default([]),
});

type CatalogFormValues = z.infer<typeof catalogFormSchema>;
type CatalogFormInput = z.input<typeof catalogFormSchema>;

export { type CatalogFormInput, catalogFormSchema, type CatalogFormValues };
