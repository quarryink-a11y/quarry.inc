"use client";

import {
  type CatalogFormInput,
  catalogFormSchema,
  type CatalogFormValues,
} from "@features/catalog/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { PhotoUploader } from "@shared/components/PhotoUploader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Switch } from "@shared/components/ui/switch";
import { Textarea } from "@shared/components/ui/textarea";
import { CatalogCategory } from "@shared/constants/enums";
import {
  CATALOG_CATEGORY_OPTIONS,
  CURRENCY_OPTIONS,
} from "@shared/constants/mappers";
import type { Catalog, CreateCatalogDto } from "@shared/types/api";
import { X } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { GiftAmountsPicker } from "./GiftAmountsPicker";

interface CatalogFormProps {
  item?: Catalog | null;
  onClose: () => void;
  onSave: (data: CreateCatalogDto) => Promise<void>;
  isSaving?: boolean;
}

function getDefaultValues(item?: Catalog | null): CatalogFormInput {
  return {
    name: item?.name ?? "",
    description: item?.description ?? "",
    price:
      item?.price !== null && item?.price !== undefined
        ? String(item.price)
        : "",
    currency: (item?.currency ?? "USD") as CatalogFormInput["currency"],
    category: (item?.category ?? CatalogCategory.OTHER) as CatalogCategory,
    image: item?.image_url
      ? { image_url: item.image_url, image_public_id: "" }
      : null,
    is_active: !!item?.is_active,
    limited_stock: !!item?.stock_quantity,
    stock_quantity:
      item?.stock_quantity !== null && item?.stock_quantity !== undefined
        ? String(item.stock_quantity)
        : "",
    gift_amounts: item?.gift_amounts ?? [],
  };
}

export function CatalogForm({
  item,
  onClose,
  onSave,
  isSaving,
}: CatalogFormProps) {
  const methods = useForm<CatalogFormInput, unknown, CatalogFormValues>({
    resolver: zodResolver(catalogFormSchema) as never,
    defaultValues: getDefaultValues(item),
  });

  const { control, handleSubmit } = methods;

  const category = useWatch({ control, name: "category" });
  const limitedStock = useWatch({ control, name: "limited_stock" });
  const image = useWatch({ control, name: "image" });

  const onSubmit = async (values: CatalogFormValues) => {
    if (!values.image) return;
    const payload: CreateCatalogDto = {
      name: values.name,
      description: values.description || undefined,
      price: values.price,
      currency: values.currency,
      category: values.category,
      image: {
        image_url: values.image.image_url,
        image_public_id: values.image.image_public_id,
      },
      is_active: values.is_active,
      stock_quantity: values.limited_stock
        ? (values.stock_quantity ?? undefined)
        : undefined,
      gift_amounts:
        values.category === CatalogCategory.GIFT_CERTIFICATE &&
        values.gift_amounts.length > 0
          ? values.gift_amounts
          : undefined,
    };
    await onSave(payload);
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="bg-blue-50/50 rounded-2xl p-6 relative"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="space-y-5">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Product name"
              required
              error={fieldState.error?.message}
            >
              <Input
                placeholder="Enter product name"
                className="bg-white rounded-xl border-gray-200"
                value={field.value}
                onChange={field.onChange}
              />
            </FormFieldWrapper>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Description"
              error={fieldState.error?.message}
            >
              <Textarea
                placeholder="Short product description"
                className="bg-white rounded-xl border-gray-200 h-20"
                value={field.value}
                onChange={field.onChange}
              />
            </FormFieldWrapper>
          )}
        />

        <div className="grid grid-cols-[1fr_120px] gap-3">
          <Controller
            control={control}
            name="price"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Price"
                required
                error={fieldState.error?.message}
              >
                <Input
                  placeholder="0.00"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="bg-white rounded-xl border-gray-200"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormFieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="currency"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Currency"
                required
                error={fieldState.error?.message}
              >
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={control}
            name="category"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Category"
                required
                error={fieldState.error?.message}
              >
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white rounded-xl border-gray-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATALOG_CATEGORY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            )}
          />
          <FormFieldWrapper label="Limited stock">
            <div className="flex items-center gap-3 h-9">
              <Controller
                control={control}
                name="limited_stock"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              {limitedStock && (
                <Controller
                  control={control}
                  name="stock_quantity"
                  render={({ field }) => (
                    <Input
                      placeholder="Qty"
                      type="number"
                      min="0"
                      step="1"
                      className="bg-white rounded-xl border-gray-200 w-24"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
            </div>
          </FormFieldWrapper>
        </div>

        {category === CatalogCategory.GIFT_CERTIFICATE && (
          <Controller
            control={control}
            name="gift_amounts"
            render={({ field }) => (
              <GiftAmountsPicker
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="image"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Photo"
              required
              error={fieldState.error?.message}
            >
              <PhotoUploader
                imageUrl={field.value?.image_url}
                publicId={field.value?.image_public_id}
                onChange={(v) =>
                  field.onChange(
                    v
                      ? { image_url: v.imageUrl, image_public_id: v.publicId }
                      : null,
                  )
                }
              />
            </FormFieldWrapper>
          )}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Visible on website</p>
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full px-8"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving ?? !image}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-8"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
