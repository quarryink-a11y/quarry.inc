"use client";

import {
  type PortfolioFormInput,
  portfolioFormSchema,
  type PortfolioFormValues,
} from "@features/portfolio/model";
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
import { Currency, SizeUnit } from "@shared/constants/enums";
import { CURRENCY_OPTIONS, SIZE_UNIT_OPTIONS } from "@shared/constants/mappers";
import type { ImageAttachment, Portfolio } from "@shared/types/api";
import { X } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";

interface PortfolioFormProps {
  item?: Portfolio | null;
  onClose: () => void;
  onSaved: () => void;
  onSave: (data: {
    image: ImageAttachment;
    price?: number;
    currency?: Currency;
    size?: number;
    size_unit?: SizeUnit;
  }) => Promise<void>;
  isSaving?: boolean;
}

export function PortfolioForm({
  item,
  onClose,
  onSaved,
  onSave,
  isSaving,
}: PortfolioFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PortfolioFormInput, unknown, PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      price: !!item?.price ? String(item.price) : "",
      currency: (item?.currency as Currency | undefined) ?? Currency.USD,
      size: !!item?.size ? String(item.size) : "",
      size_unit: (item?.size_unit as SizeUnit | undefined) ?? SizeUnit.CM,
      image:
        item?.image_url && item?.image_public_id
          ? { image_url: item.image_url, image_public_id: item.image_public_id }
          : null,
    },
  });

  const image = useWatch({ control, name: "image" });

  const onSubmit = async (values: PortfolioFormValues) => {
    if (!values.image) return;
    await onSave({
      image: values.image,
      price: values.price,
      currency: values.currency,
      size: values.size,
      size_unit: values.size_unit,
    });
    onSaved();
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
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <FormFieldWrapper
            label="Price (optional)"
            error={errors.price?.message}
          >
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <Input
                  placeholder="Enter the price"
                  type="number"
                  className="bg-white rounded-xl border-gray-200"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value.slice(0, 5))}
                />
              )}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="Currency" error={errors.currency?.message}>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
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
              )}
            />
          </FormFieldWrapper>
        </div>

        <div className="grid grid-cols-[1fr_120px] gap-3">
          <FormFieldWrapper
            label="Size (optional)"
            error={errors.size?.message}
          >
            <Controller
              control={control}
              name="size"
              render={({ field }) => (
                <Input
                  placeholder="e.g. 20"
                  type="number"
                  className="bg-white rounded-xl border-gray-200"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value.slice(0, 5))}
                />
              )}
            />
            <p className="text-xs text-gray-400">Height in selected units</p>
          </FormFieldWrapper>

          <FormFieldWrapper label="Unit" error={errors.size_unit?.message}>
            <Controller
              control={control}
              name="size_unit"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_UNIT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.value.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper label="Photo" error={errors.image?.message} required>
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
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
            )}
          />
        </FormFieldWrapper>

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
