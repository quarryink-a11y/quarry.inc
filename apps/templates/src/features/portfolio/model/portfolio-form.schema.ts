import { Currency, SizeUnit } from "@shared/constants/enums";
import { z } from "zod";

const imageAttachmentSchema = z.object({
  image_url: z.string(),
  image_public_id: z.string(),
});

const optionalNumber = z
  .string()
  .default("")
  .transform((v) => (v === "" ? undefined : parseFloat(v)));

const currencyValues = Object.values(Currency) as [Currency, ...Currency[]];
const sizeUnitValues = Object.values(SizeUnit) as [SizeUnit, ...SizeUnit[]];

const portfolioFormSchema = z.object({
  price: optionalNumber,
  currency: z.enum(currencyValues).default(Currency.USD),
  size: optionalNumber,
  size_unit: z.enum(sizeUnitValues).default(SizeUnit.CM),
  image: imageAttachmentSchema.nullable().default(null),
});

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;
type PortfolioFormInput = z.input<typeof portfolioFormSchema>;

export {
  type PortfolioFormInput,
  portfolioFormSchema,
  type PortfolioFormValues,
};
