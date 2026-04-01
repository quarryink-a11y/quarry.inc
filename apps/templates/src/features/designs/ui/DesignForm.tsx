"use client";

import { useCreateDesign, useUpdateDesign } from "@features/designs/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { PhotoUploader } from "@shared/components/PhotoUploader";
import { Button } from "@shared/components/ui/button";
import { Checkbox } from "@shared/components/ui/checkbox";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { CURRENCY_OPTIONS, SIZE_UNIT_OPTIONS } from "@shared/constants/mappers";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  type DesignFormInput,
  type DesignFormValues,
  type DesignItem,
  formSchema,
  PLACEMENTS,
} from "../model";

interface DesignFormProps {
  item?: DesignItem | null;
  onClose: () => void;
  onSaved: () => void;
}

function getDefaultValues(item?: DesignItem | null): DesignFormInput {
  return {
    name: item?.name ?? "",
    price:
      item?.price !== undefined && item?.price !== null
        ? String(item.price)
        : "",
    currency: item?.currency ?? "USD",
    size:
      item?.size !== undefined && item?.size !== null ? String(item.size) : "",
    size_unit: item?.size_unit ?? "CM",
    preferred_body_placement: item?.preferred_body_placement ?? [],
    image:
      item?.image_url && item?.image_public_id
        ? { image_url: item.image_url, image_public_id: item.image_public_id }
        : null,
  };
}

export function DesignForm({ item, onClose, onSaved }: DesignFormProps) {
  const isEditing = Boolean(item?.id);
  const createItem = useCreateDesign();
  const updateItem = useUpdateDesign();

  const [placementOpen, setPlacementOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const methods = useForm<DesignFormInput, unknown, DesignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(item),
  });

  const { control, handleSubmit, reset, setValue } = methods;

  const preferredPlacements =
    useWatch({ control, name: "preferred_body_placement" }) ?? [];

  const image = useWatch({ control, name: "image" });

  useEffect(() => {
    reset(getDefaultValues(item));
  }, [item, reset]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setPlacementOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const togglePlacement = (placement: string) => {
    const next = preferredPlacements.includes(placement)
      ? preferredPlacements.filter((value) => value !== placement)
      : [...preferredPlacements, placement];

    setValue("preferred_body_placement", next, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (values: DesignFormValues) => {
    if (!values.image) return;

    const payload = {
      ...values,
      image: values.image ?? undefined,
      preferred_body_placement: values.preferred_body_placement,
    };

    try {
      if (isEditing && item?.id) {
        await updateItem.mutateAsync({
          id: item.id,
          ...payload,
        });
      } else {
        await createItem.mutateAsync(payload);
      }

      onSaved();
    } catch (error) {
      console.error("Save design error:", error);
    }
  };

  const placementLabel =
    preferredPlacements.length > 0
      ? preferredPlacements.join(", ")
      : "Select the placement";

  const saving = createItem.isPending || updateItem.isPending;

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
              label={isEditing ? "Name of the design" : "Design name"}
              error={fieldState.error?.message}
            >
              <Input
                placeholder="Enter the name"
                className="bg-white rounded-xl border-gray-200"
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
              <FormFieldWrapper label="Price" error={fieldState.error?.message}>
                <Input
                  placeholder="Enter the price"
                  type="number"
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
                error={fieldState.error?.message}
              >
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="grid grid-cols-[1fr_120px] gap-3">
          <Controller
            control={control}
            name="size"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label={
                  <>
                    Size{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </>
                }
                error={fieldState.error?.message}
              >
                <Input
                  placeholder="e.g. 20"
                  type="number"
                  className="bg-white rounded-xl border-gray-200"
                  value={field.value}
                  onChange={field.onChange}
                />
                <p className="text-xs text-blue-400">
                  Height in selected units
                </p>
              </FormFieldWrapper>
            )}
          />

          <Controller
            control={control}
            name="size_unit"
            render={({ field, fieldState }) => (
              <FormFieldWrapper label="Unit" error={fieldState.error?.message}>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white rounded-xl border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_UNIT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            )}
          />
        </div>

        <div ref={dropdownRef} className="relative">
          <FormFieldWrapper label="Preferred body placement">
            <button
              type="button"
              onClick={() => setPlacementOpen((prev) => !prev)}
              className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-200 px-3 h-9 text-sm"
            >
              <span
                className={
                  preferredPlacements.length > 0
                    ? "text-gray-900 truncate pr-2"
                    : "text-gray-400"
                }
              >
                {placementLabel}
              </span>

              {placementOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              )}
            </button>

            {placementOpen && (
              <div className="mt-1 bg-white border border-gray-200 rounded-xl p-3 space-y-3 max-h-72 overflow-y-auto">
                {PLACEMENTS.map((placement) => (
                  <Controller
                    key={placement}
                    control={control}
                    name="preferred_body_placement"
                    render={() => (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={preferredPlacements.includes(placement)}
                          onCheckedChange={() => togglePlacement(placement)}
                        />
                        <span className="text-sm text-gray-700">
                          {placement}
                        </span>
                      </label>
                    )}
                  />
                ))}
              </div>
            )}
          </FormFieldWrapper>
        </div>

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
                      ? {
                          image_url: v.imageUrl,
                          image_public_id: v.publicId,
                        }
                      : null,
                  )
                }
              />
            </FormFieldWrapper>
          )}
        />

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
            disabled={saving || !image}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-8"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
