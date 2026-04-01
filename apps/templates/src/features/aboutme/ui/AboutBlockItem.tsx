"use client";

import { CharacterCounter } from "@quarry/shared-components";
import { FormFieldWrapper } from "@quarry/shared-components";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";

import type { AboutFormValues } from "../model";

interface AboutBlockItemProps {
  index: number;
  onRemove: (index: number) => void;
}

export function AboutBlockItem({ index, onRemove }: AboutBlockItemProps) {
  const { control } = useFormContext<AboutFormValues>();

  const titleValue = useWatch({ control, name: `blocks.${index}.title` }) ?? "";
  const textValue = useWatch({ control, name: `blocks.${index}.text` }) ?? "";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Title
            </label>

            <Controller
              control={control}
              name={`blocks.${index}.title`}
              render={({ field, fieldState }) => (
                <FormFieldWrapper error={fieldState.error?.message}>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Enter block title"
                  />
                  <CharacterCounter
                    current={titleValue.length}
                    max={120}
                    className="mt-1"
                  />
                </FormFieldWrapper>
              )}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Text
            </label>

            <Controller
              control={control}
              name={`blocks.${index}.text`}
              render={({ field }) => (
                <>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Enter block description"
                    className="min-h-28 resize-none"
                    maxLength={500}
                  />
                  <CharacterCounter
                    className="mt-1"
                    current={textValue.length}
                    max={500}
                  />
                </>
              )}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="shrink-0 text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
