"use client";

import { useCreateEvent, useUpdateEvent } from "@features/events/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { PhotoUploader } from "@shared/components/PhotoUploader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import type { Event } from "@/shared/types/api";

import { eventFormSchema, type EventFormValues } from "../model";
import { CountrySearch } from "./CountrySearch";

interface EventFormProps {
  item?: Event | null;
  onClose: () => void;
  onSaved: () => void;
}

function getDefaultValues(item?: Event | null): EventFormValues {
  return {
    city: item?.city ?? "",
    country: item?.country ?? "",
    start_at: item?.start_at ? item.start_at.split("T")[0] : "",
    end_at: item?.end_at ? item.end_at.split("T")[0] : null,
    location: item?.location ?? "",
    image:
      item?.image_url && item?.image_public_id
        ? { image_url: item.image_url, image_public_id: item.image_public_id }
        : null,
  };
}

export function EventForm({ item, onClose, onSaved }: EventFormProps) {
  const isEditing = Boolean(item?.id);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as never,
    defaultValues: getDefaultValues(item),
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = form;

  const image = useWatch({ control, name: "image" });

  useEffect(() => {
    reset(getDefaultValues(item));
  }, [item, reset]);

  const onSubmit = async (values: EventFormValues) => {
    if (!values.image) return;

    const payload = {
      city: values.city,
      country: values.country,
      start_at: values.start_at,
      end_at: values.end_at ?? undefined,
      location: values.location,
      image: values.image,
    };

    if (isEditing && item?.id) {
      await updateEvent.mutateAsync({
        id: item.id,
        ...payload,
      });
    } else {
      await createEvent.mutateAsync(payload);
    }

    onSaved();
  };

  const saving = createEvent.isPending || updateEvent.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
          name="city"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="City"
              required
              error={fieldState.error?.message}
            >
              <CountrySearch value={field.value} onChange={field.onChange} />
            </FormFieldWrapper>
          )}
        />

        <FormFieldWrapper label="Country" error={errors.country?.message}>
          <Input
            placeholder="e.g. United States"
            className="bg-white rounded-xl border-gray-200"
            {...register("country")}
          />
        </FormFieldWrapper>

        <div className="grid grid-cols-2 gap-3">
          <FormFieldWrapper
            label="Start date"
            required
            error={errors.start_at?.message}
          >
            <Input
              type="date"
              className="bg-white rounded-xl border-gray-200"
              {...register("start_at")}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="End date" error={errors.end_at?.message}>
            <Input
              type="date"
              className="bg-white rounded-xl border-gray-200"
              {...register("end_at")}
            />
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          label="Location"
          required
          error={errors.location?.message}
        >
          <Input
            placeholder="Enter the name of the studio or event location"
            className="bg-white rounded-xl border-gray-200"
            {...register("location")}
          />
        </FormFieldWrapper>

        <Controller
          control={control}
          name="image"
          render={({ field, fieldState }) => (
            <FormFieldWrapper label="Photo" error={fieldState.error?.message}>
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
            disabled={saving || !isValid || !image}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-8"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
