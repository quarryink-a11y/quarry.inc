"use client";

import {
  useCreateBookingStep,
  useUpdateBookingStep,
} from "@features/how-to-book/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import type { BookingStep } from "@shared/types/api";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { bookingStepFormSchema, type BookingStepFormValues } from "../model";

interface BookingStepFormProps {
  editingStep?: BookingStep | null;
  totalSteps: number;
  onSaved: () => void;
  onCancel: () => void;
}

function getDefaultValues(
  editingStep?: BookingStep | null,
): BookingStepFormValues {
  return {
    title: editingStep?.title ?? "",
    description: editingStep?.description ?? "",
  };
}

export function BookingStepForm({
  editingStep,
  totalSteps,
  onSaved,
  onCancel,
}: BookingStepFormProps) {
  const createStep = useCreateBookingStep();
  const updateStep = useUpdateBookingStep();
  const isPending = createStep.isPending || updateStep.isPending;

  const form = useForm<BookingStepFormValues>({
    resolver: zodResolver(bookingStepFormSchema) as never,
    defaultValues: getDefaultValues(editingStep),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isValid },
  } = form;

  const title = useWatch({ control, name: "title" }) || "";
  const description = useWatch({ control, name: "description" }) || "";

  useEffect(() => {
    reset(getDefaultValues(editingStep));
  }, [editingStep, reset]);

  const stepNumber = editingStep
    ? (editingStep.sort_order ?? 1)
    : totalSteps + 1;

  const onSubmit = async (values: BookingStepFormValues) => {
    try {
      if (editingStep) {
        await updateStep.mutateAsync({
          id: editingStep.id,
          title: values.title,
          description: values.description,
        });
      } else {
        await createStep.mutateAsync({
          title: values.title,
          description: values.description,
          sort_order: totalSteps + 1,
        });
      }

      onSaved();
    } catch (e) {
      console.error("Save step error:", e);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4"
    >
      <h3 className="font-semibold text-gray-900">
        {editingStep ? "Edit step" : "Add new step"}
      </h3>

      <FormFieldWrapper
        label={
          <>
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
              {stepNumber}
            </span>
            Title
          </>
        }
        styles={{ label: "flex items-center gap-2 font-medium text-gray-700" }}
        error={errors.title?.message}
      >
        <Input
          placeholder='e.g. "Consultation", "Deposit", "Drawing design"'
          maxLength={25}
          {...register("title", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.replace(/[0-9]/g, "");
              setValue("title", value, {
                shouldDirty: true,
                shouldTouch: true,
              });
            },
          })}
        />
        <p className="text-xs text-gray-400">
          {title.length}/25 · Examples: Consultation, Deposit, Drawing design
        </p>
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Description"
        styles={{ label: "font-medium text-gray-700" }}
        error={errors.description?.message}
      >
        <Textarea
          placeholder={`Describe what happens at this step...\n\nFor example: "Fill out the booking form describing your tattoo idea, preferred placement, size, and dates. Please attach 1–3 reference images."`}
          maxLength={500}
          className="h-28 resize-none"
          {...register("description")}
        />
        <p className="text-xs text-gray-400">
          {description.length}/500 characters
        </p>
      </FormFieldWrapper>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isPending || !isValid}
          className="bg-blue-500 hover:bg-blue-600 rounded-xl gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {editingStep ? "Save changes" : "Add step"}
        </Button>
      </div>
    </form>
  );
}
