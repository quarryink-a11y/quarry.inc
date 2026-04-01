"use client";

import { CharacterCounter } from "@quarry/shared-components";
import { FormFieldWrapper } from "@quarry/shared-components";
import { PhotoUploader } from "@shared/components/PhotoUploader";
import { Button } from "@shared/components/ui/button";
import { Textarea } from "@shared/components/ui/textarea";
import { Plus } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

import type { AboutFormValues } from "../model";
import { AboutBlockItem } from "./AboutBlockItem";
import { AboutHintTooltip } from "./AboutHintTooltip";

export function AboutForm() {
  const { control } = useFormContext<AboutFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "blocks",
  });

  const textValue = useWatch({ control, name: "text" }) ?? "";

  return (
    <div className="space-y-5">
      <Controller
        control={control}
        name="photo_url"
        render={({ field }) => (
          <PhotoUploader
            imageUrl={field.value ?? ""}
            onChange={(v) => field.onChange(v?.imageUrl ?? "")}
          />
        )}
      />

      <Controller
        control={control}
        name="text"
        render={({ field, fieldState }) => (
          <FormFieldWrapper
            label={
              <>
                About me
                <AboutHintTooltip />
              </>
            }
            styles={{
              label: "flex items-center gap-2 font-medium text-gray-700",
            }}
            error={fieldState.error?.message}
          >
            <Textarea
              placeholder="Share your experience, philosophy, and what drives your art..."
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              maxLength={1200}
              className="h-36 resize-none"
            />
            <CharacterCounter current={textValue.length} max={1200} min={200} />
          </FormFieldWrapper>
        )}
      />

      {fields.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Additional blocks
          </label>

          {fields.map((field, index) => (
            <AboutBlockItem key={field.id} index={index} onRemove={remove} />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ title: "", text: "" })}
        className="w-full gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-500"
      >
        <Plus className="h-4 w-4" />
        Add block
      </Button>
    </div>
  );
}
