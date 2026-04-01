"use client";

import { useSubmitInquiry } from "@features/consultation/api";
import {
  consultationFormSchema,
  type ConsultationFormValues,
} from "@features/consultation/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { Button } from "@shared/components/ui/button";
import { Calendar } from "@shared/components/ui/calendar";
import { Input } from "@shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import type { ReferralSource } from "@shared/constants/enums";
import { BodyPlacement } from "@shared/constants/enums";
import { REFERRAL_SOURCE_OPTIONS } from "@shared/constants/mappers";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { InspirationUploader } from "./InspirationUploader";

const placements = Object.values(BodyPlacement);

interface PlacementMultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

function PlacementMultiSelect({
  options,
  value = [],
  onChange,
  placeholder,
}: PlacementMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val: string) => {
    const next = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(next);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm flex items-center justify-between gap-2 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length === 0 && (
            <span className="text-gray-400">{placeholder}</span>
          )}
          {value.map((v) => (
            <span
              key={v}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md flex items-center gap-1"
            >
              {v}
              <X
                className="w-3 h-3 cursor-pointer opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(value.filter((x) => x !== v));
                }}
              />
            </span>
          ))}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const isActive = value.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`w-full text-left px-3 py-2 text-sm ${isActive ? "bg-gray-100" : "hover:bg-gray-50"} flex items-center justify-between`}
              >
                <span>{opt}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-gray-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ConsultationFormProps {
  preview?: boolean;
  cityOptions?: { value: string; label: string }[];
}

export function ConsultationForm({
  preview = false,
  cityOptions = [],
}: ConsultationFormProps) {
  const { mutateAsync: submitInquiry, isPending: submitting } =
    useSubmitInquiry();
  const [submitted, setSubmitted] = useState(false);

  const { control, handleSubmit, formState } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      idea_description: "",
      placement: [],
      size_unit: "",
      size_value: "",
      preferred_date: "",
      inspiration_urls: [],
      city: "",
      referral_source: "" as ReferralSource,
      client_email: "",
      client_phone: "",
    },
  });

  const onSubmit = async (values: ConsultationFormValues) => {
    if (preview) return;
    await submitInquiry(values);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
        <p className="text-gray-500">
          Your inquiry has been submitted. I will get back to you as soon as
          possible.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Get a consultation
        </h1>
        <p className="text-sm text-gray-500">
          Fill out the form below and I will get back to you as soon as
          possible.
        </p>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="first_name"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="First name"
                required
                styles={{ label: "font-medium text-gray-700" }}
                error={fieldState.error?.message}
              >
                <Input
                  placeholder="Enter your first name"
                  className="border-gray-200 rounded-lg"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormFieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="last_name"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Last name"
                required
                styles={{ label: "font-medium text-gray-700" }}
                error={fieldState.error?.message}
              >
                <Input
                  placeholder="Enter your last name"
                  className="border-gray-200 rounded-lg"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <Controller
          control={control}
          name="idea_description"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="What's your tattoo idea?"
              required
              styles={{ label: "font-medium text-gray-700" }}
              error={fieldState.error?.message}
            >
              <textarea
                placeholder="Describe main details you would like to see in design"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={field.value}
                onChange={field.onChange}
              />
            </FormFieldWrapper>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <Controller
            control={control}
            name="placement"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Placement"
                required
                styles={{ label: "font-medium text-gray-700" }}
                error={fieldState.error?.message}
              >
                <PlacementMultiSelect
                  options={placements}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select placements"
                />
              </FormFieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="size_value"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Approximately size"
                required
                styles={{ label: "font-medium text-gray-700" }}
                error={fieldState.error?.message}
              >
                <Input
                  placeholder="e.g. 10"
                  className="border-gray-200 rounded-lg"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormFieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="size_unit"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Size unit"
                required
                styles={{ label: "font-medium text-gray-700" }}
                error={fieldState.error?.message}
              >
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border-gray-200 rounded-lg">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Centimeters">Centimeters</SelectItem>
                    <SelectItem value="Inches">Inches</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            )}
          />
        </div>

        <Controller
          control={control}
          name="preferred_date"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Preferable day for an appointment?"
              required
              styles={{ label: "font-medium text-gray-700" }}
              error={fieldState.error?.message}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-200 rounded-lg"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    {field.value
                      ? format(new Date(field.value), "PPP")
                      : "Select a date..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date?.toISOString() ?? "")
                    }
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </FormFieldWrapper>
          )}
        />

        <Controller
          control={control}
          name="inspiration_urls"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Inspiration"
              required
              styles={{ label: "font-medium text-gray-700" }}
              error={fieldState.error?.message}
            >
              <p className="text-xs text-gray-400">
                Add one or more photos or sketches you like.
              </p>
              <InspirationUploader
                files={field.value}
                onChange={field.onChange}
              />
            </FormFieldWrapper>
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="In which city would you like to get a tattoo?"
              required
              styles={{ label: "font-medium text-gray-700" }}
              error={fieldState.error?.message}
            >
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-gray-200 rounded-lg">
                  <SelectValue placeholder="Choose a city" />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                  {cityOptions.length === 0 && (
                    <SelectItem value="other" disabled>
                      No locations available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          )}
        />

        <Controller
          control={control}
          name="referral_source"
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="How did you find out about me?"
              required
              styles={{ label: "font-medium text-gray-700" }}
              error={fieldState.error?.message}
            >
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-gray-200 rounded-lg">
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  {REFERRAL_SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={`${s.value}.${s.label}`} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="client_email"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="E-mail"
                required
                styles={{ label: "font-medium text-gray-700" }}
                error={fieldState.error?.message}
              >
                <Input
                  type="email"
                  placeholder="Enter your e-mail"
                  className="border-gray-200 rounded-lg"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormFieldWrapper>
            )}
          />
          <Controller
            control={control}
            name="client_phone"
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Phone number"
                required
                styles={{ label: "font-medium text-gray-700" }}
                error={fieldState.error?.message}
              >
                <Input
                  placeholder="Enter your phone number"
                  className="border-gray-200 rounded-lg"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={!formState.isValid || submitting || preview}
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-12 py-3 text-base font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...
              </>
            ) : (
              "Get a consultation"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
