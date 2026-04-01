"use client";

import { PhoneInput } from "@features/contacts/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { Button } from "@shared/components/ui/button";
import { Checkbox } from "@shared/components/ui/checkbox";
import { Input } from "@shared/components/ui/input";
import { Eye, EyeOff, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

import type { AdminItem } from "../model";
import { adminFormSchema, type AdminFormValues, MODULES } from "../model";

interface AdminFormProps {
  admin?: AdminItem | null;
  onSave: (data: AdminFormValues) => Promise<void>;
  onCancel: () => void;
}

function NameFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdminFormValues>();

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormFieldWrapper label="First name" error={errors.first_name?.message}>
        <Input
          {...register("first_name")}
          placeholder="Enter first name"
          className="bg-white rounded-xl border-gray-200"
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Last name" error={errors.last_name?.message}>
        <Input
          {...register("last_name")}
          placeholder="Enter last name"
          className="bg-white rounded-xl border-gray-200"
        />
      </FormFieldWrapper>
    </div>
  );
}

function ContactFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdminFormValues>();
  const isEdit = useWatch({ control, name: "isEdit" });

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormFieldWrapper label="Email" error={errors.email?.message}>
        <Input
          {...register("email")}
          placeholder="Enter email"
          className="bg-white rounded-xl border-gray-200"
          disabled={isEdit}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Phone number"
        error={
          errors.phone_code?.message ??
          errors.phone_country_code?.message ??
          errors.phone_number?.message
        }
      >
        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <Controller
              name="phone_code"
              control={control}
              render={({ field: phoneCodeField }) => (
                <Controller
                  name="phone_country_code"
                  control={control}
                  render={({ field: countryCodeField }) => (
                    <PhoneInput
                      code={phoneCodeField.value}
                      countryId={countryCodeField.value}
                      number={field.value}
                      onCodeChange={(code, id) => {
                        phoneCodeField.onChange(code);
                        countryCodeField.onChange(id);
                      }}
                      onNumberChange={field.onChange}
                    />
                  )}
                />
              )}
            />
          )}
        />
      </FormFieldWrapper>
    </div>
  );
}

function PasswordFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdminFormValues>();
  const isEdit = useWatch({ control, name: "isEdit" });

  const [showPass, setShowPass] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  if (isEdit) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormFieldWrapper label="Password" error={errors.password?.message}>
        <div className="relative">
          <Input
            {...register("password")}
            type={showPass ? "text" : "password"}
            placeholder="Type the password"
            className="bg-white rounded-xl border-gray-200 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPass ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Repeat password"
        error={errors.repeat_password?.message}
      >
        <div className="relative">
          <Input
            {...register("repeat_password")}
            type={showRepeat ? "text" : "password"}
            placeholder="Type the password"
            className="bg-white rounded-xl border-gray-200 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowRepeat((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showRepeat ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </FormFieldWrapper>
    </div>
  );
}

function ModulesField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AdminFormValues>();
  const selectedModules = useWatch({
    control,
    name: "access_modules",
    defaultValue: [],
  });

  return (
    <FormFieldWrapper
      label="Access to modules"
      error={errors.access_modules?.message}
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        {MODULES.map((mod) => (
          <Controller
            key={mod}
            name="access_modules"
            control={control}
            render={({ field }) => {
              const checked = selectedModules.includes(mod);

              return (
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(nextChecked) => {
                      if (nextChecked) {
                        field.onChange([...field.value, mod]);
                        return;
                      }

                      field.onChange(
                        field.value.filter((item: string) => item !== mod),
                      );
                    }}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <span className="text-sm text-gray-700">{mod}</span>
                </label>
              );
            }}
          />
        ))}
      </div>
    </FormFieldWrapper>
  );
}

function FormActions({ saving }: { saving: boolean }) {
  const { control } = useFormContext<AdminFormValues>();
  const isEdit = useWatch({ control, name: "isEdit" });

  if (isEdit) {
    return (
      <div className="flex justify-center gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("admin-form-cancel"))
          }
          className="rounded-full px-8 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="bg-red-500 hover:bg-red-600 rounded-full px-8"
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-3 pt-6">
      <Button
        type="submit"
        disabled={saving}
        className="bg-blue-500 hover:bg-blue-600 rounded-full px-10"
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

export function AdminForm({ admin, onSave, onCancel }: AdminFormProps) {
  const isEdit = Boolean(admin);

  const defaultValues = useMemo<AdminFormValues>(
    () => ({
      first_name: admin?.first_name ?? "",
      last_name: admin?.last_name ?? "",
      email: admin?.email ?? "",
      phone_code: admin?.phone_code ?? "+1",
      phone_country_code: admin?.phone_country_code ?? "us",
      phone_number: admin?.phone_number ?? "",
      password: "",
      repeat_password: "",
      access_modules: (admin?.access_modules ??
        []) as AdminFormValues["access_modules"],
      isEdit,
    }),
    [admin, isEdit],
  );

  const methods = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema) as never,
    defaultValues,
    mode: "onSubmit",
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = methods.handleSubmit(async (values) => {
    try {
      setSaving(true);
      await onSave(values);
    } finally {
      setSaving(false);
    }
  });

  useState(() => {
    const handler = () => onCancel();
    window.addEventListener("admin-form-cancel", handler);
    return () => window.removeEventListener("admin-form-cancel", handler);
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={() => {
          void handleSubmit();
        }}
        className="bg-blue-50/50 rounded-2xl p-6 relative"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="space-y-4">
          <NameFields />
          <ContactFields />
          <PasswordFields />
          <ModulesField />
        </div>

        <FormActions saving={saving} />
      </form>
    </FormProvider>
  );
}
