"use client";

import {
  faqQuestionFormSchema,
  type FaqQuestionFormValues,
} from "@features/faq/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface FaqQuestionFormProps {
  categoryId: string;
  onSave: (
    categoryId: string,
    data: { question: string; answer: string },
  ) => Promise<void>;
  onCancel: () => void;
}

export function FaqQuestionForm({
  categoryId,
  onSave,
  onCancel,
}: FaqQuestionFormProps) {
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit } = useForm<FaqQuestionFormValues>({
    resolver: zodResolver(faqQuestionFormSchema),
    defaultValues: { question: "", answer: "" },
  });

  const onSubmit = async (values: FaqQuestionFormValues) => {
    setSaving(true);
    await onSave(categoryId, values);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4"
      >
        <h3 className="font-semibold text-gray-900">Add question</h3>

        <Controller
          control={control}
          name="question"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Question"
              styles={{ label: "font-medium text-gray-700" }}
              error={fieldState.error?.message}
            >
              <Input
                placeholder="e.g. How long does a session last?"
                maxLength={200}
                value={field.value}
                onChange={field.onChange}
              />
            </FormFieldWrapper>
          )}
        />

        <Controller
          control={control}
          name="answer"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Answer (optional)"
              styles={{ label: "font-medium text-gray-700" }}
              error={fieldState.error?.message}
            >
              <Textarea
                placeholder="Write your answer..."
                maxLength={2000}
                className="h-28 resize-none"
                value={field.value}
                onChange={field.onChange}
              />
            </FormFieldWrapper>
          )}
        />

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
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Add
          </Button>
        </div>
      </form>
    </div>
  );
}
