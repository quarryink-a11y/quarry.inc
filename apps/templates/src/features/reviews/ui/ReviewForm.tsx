"use client";

import { useCreateReview, useUpdateReview } from "@features/reviews/api";
import {
  reviewFormSchema,
  type ReviewFormValues,
} from "@features/reviews/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { CharacterCounter, FormFieldWrapper } from "@quarry/shared-components";
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
import { Textarea } from "@shared/components/ui/textarea";
import type { Review } from "@shared/types/api";
import { X } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import { REVIEW_SOURCE_OPTIONS } from "@/shared/constants/mappers";

interface ReviewFormProps {
  item?: Review | null;
  onClose: () => void;
  onSaved: () => void;
}

function getDefaultValues(item?: Review | null): ReviewFormValues {
  return {
    client_name: item?.client_name ?? "",
    review_source: item?.review_source ?? "",
    client_profile_url: item?.client_profile_url ?? "",
    client_image:
      item?.client_image_url && item?.client_image_public_id
        ? {
            image_url: item.client_image_url,
            image_public_id: item.client_image_public_id,
          }
        : null,
    review_text: item?.review_text ?? "",
  };
}

export function ReviewForm({ item, onClose, onSaved }: ReviewFormProps) {
  const isEditing = !!item?.id;
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  const { control, handleSubmit } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: getDefaultValues(item),
  });

  const reviewText = useWatch({ control, name: "review_text" }) ?? "";

  const saving = createReview.isPending || updateReview.isPending;

  const onSubmit = async (values: ReviewFormValues) => {
    const { client_image, ...rest } = values;
    const payload = {
      ...rest,
      client_image: client_image ?? undefined,
    };

    try {
      if (isEditing && item?.id) {
        await updateReview.mutateAsync({ id: item.id, ...payload });
      } else {
        await createReview.mutateAsync(payload);
      }
      onSaved();
    } catch (error) {
      console.error("Save review error:", error);
      toast.error("Failed to save review");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-blue-50/50 rounded-2xl p-10 relative"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <Controller
            control={control}
            name="client_name"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Client's name"
                required
                error={fieldState.error?.message}
              >
                <Input
                  placeholder="Enter name"
                  className="bg-white rounded-xl border-gray-200"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormFieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="review_source"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Review source"
                required
                error={fieldState.error?.message}
              >
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white rounded-xl border-gray-200">
                    <SelectValue placeholder="Select review source" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVIEW_SOURCE_OPTIONS.map((s) => (
                      <SelectItem key={`${s.label}.${s.value}`} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            )}
          />
        </div>

        <Controller
          control={control}
          name="client_profile_url"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Client profile link"
              error={fieldState.error?.message}
            >
              <Input
                placeholder="Paste the link"
                className="bg-white rounded-xl border-gray-200"
                value={field.value}
                onChange={field.onChange}
              />
            </FormFieldWrapper>
          )}
        />

        <Controller
          control={control}
          name="client_image"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Client photo"
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

        <Controller
          control={control}
          name="review_text"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label={
                <>
                  Review
                  <CharacterCounter
                    as="div"
                    className="ml-2 text-md text-gray-400"
                    current={reviewText.length}
                    max={500}
                    withoutLabel
                    withoutMinWarning
                  />
                </>
              }
              required
              styles={{ label: "flex items-center" }}
              error={fieldState.error?.message}
            >
              <Textarea
                placeholder="Write a review here"
                className="bg-white rounded-xl border-gray-200 min-h-[180px] resize-none"
                value={field.value}
                onChange={field.onChange}
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
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-8"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
