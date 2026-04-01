"use client";

import {
  COUNTRY_NAME_TO_PHONE,
  OPTIONAL_SOCIALS,
} from "@features/contacts/lib/constants";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@features/contacts/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { generateSlug } from "@quarry/shared-utils";
import {
  Globe,
  Loader2,
  type LucideIcon,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import { COUNTRY_CODES, LocationSearch, PhoneInput } from "@/features/contacts";
import { PhotoUploader } from "@/shared/components/PhotoUploader";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

type OptionalSocialKey = (typeof OPTIONAL_SOCIALS)[number]["key"];

function matchPhoneCountry(name: string) {
  if (!name) return null;
  const id = COUNTRY_NAME_TO_PHONE[name.toLowerCase().trim()];
  if (!id) return null;

  const m = COUNTRY_CODES.find((c) => c.id === id);
  return m ? { code: m.code, id: m.id } : null;
}

interface ContactsTabProps {
  initialValues: ContactFormValues;
  isPending?: boolean;
  handleCancel: () => void;
  handleSave: (values: ContactFormValues) => void | Promise<void>;
}

export function ContactsTab({
  initialValues,
  isPending = false,
  handleCancel,
  handleSave,
}: ContactsTabProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      ...initialValues,
      artist_full_name: initialValues.artist_full_name ?? "",
      short_description: initialValues.short_description ?? "",
      profile_image_url: initialValues.profile_image_url ?? "",
      country: initialValues.country ?? "",
      city: initialValues.city ?? "",
      studio_name: initialValues.studio_name ?? "",
      studio_address: initialValues.studio_address ?? "",
      email: initialValues.email ?? "",
      phone_code: initialValues.phone_code ?? "",
      phone_country_id: initialValues.phone_country_id ?? "",
      phone_number: initialValues.phone_number ?? "",
      instagram: initialValues.instagram ?? "",
      telegram: initialValues.telegram ?? "",
      whatsapp: initialValues.whatsapp ?? "",
      tiktok: initialValues.tiktok ?? "",
      facebook: initialValues.facebook ?? "",
      youtube: initialValues.youtube ?? "",
      image_url: initialValues.image_url ?? "",
    },
    mode: "onChange",
  });

  const artistFullName = useWatch({ control, name: "artist_full_name" });
  const shortDescription = useWatch({ control, name: "short_description" });
  const country = useWatch({ control, name: "country" });
  const phoneCode = useWatch({ control, name: "phone_code" });
  const phoneCountryId = useWatch({ control, name: "phone_country_id" });

  const optionalSocialsState = useWatch({
    control,
    name: ["telegram", "whatsapp", "tiktok", "facebook", "youtube"],
  });

  const socialsMap = useMemo(
    () => ({
      telegram: optionalSocialsState[0],
      whatsapp: optionalSocialsState[1],
      tiktok: optionalSocialsState[2],
      facebook: optionalSocialsState[3],
      youtube: optionalSocialsState[4],
    }),
    [optionalSocialsState],
  );

  const visibleOptionalSocials = OPTIONAL_SOCIALS.filter(
    (social) => !!socialsMap[social.key],
  );

  const hiddenOptionalSocials = OPTIONAL_SOCIALS.filter(
    (social) => !socialsMap[social.key],
  );

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await handleSave(values);
    } catch {
      toast.error("Failed to save contacts");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SectionHeader
        icon={User}
        title="Artist Profile"
        subtitle="Your name & bio — shown on your site and invoices"
      />

      <div className="space-y-4 mb-8">
        <FormFieldWrapper
          label="Artist full name"
          error={errors.artist_full_name?.message}
          required
        >
          <Controller
            control={control}
            name="artist_full_name"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[0-9]/g, "")
                    .slice(0, 30);
                  field.onChange(value);
                }}
                placeholder="e.g. Anna Zelenska"
                maxLength={30}
                className="bg-white rounded-xl border-gray-200"
              />
            )}
          />
          <p className="text-xs text-gray-400">
            {artistFullName?.length || 0}/30 · Used as headline on your site &
            business name on invoices
          </p>
        </FormFieldWrapper>

        {artistFullName && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 mb-1">Your free domain:</p>
            <p className="text-sm font-medium text-blue-700">
              quarry.ink/{generateSlug(artistFullName)}
            </p>
          </div>
        )}

        <FormFieldWrapper
          label="Short description"
          error={errors.short_description?.message}
          required
        >
          <Controller
            control={control}
            name="short_description"
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value.slice(0, 150))}
                placeholder='"Tattoo artist who creates small color tattoos inspired by fantasy, anime, and art."'
                maxLength={150}
                className="h-20 resize-none bg-white rounded-xl border-gray-200"
              />
            )}
          />
          <p className="text-xs text-gray-400">
            {shortDescription?.length ?? 0}/150 · Shown under your name on the
            site
          </p>
        </FormFieldWrapper>
      </div>

      <SectionHeader
        icon={MapPin}
        title="Location & Studio"
        subtitle="Where clients can find you"
      />

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper
            label="Country"
            error={errors.country?.message}
            required
          >
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <LocationSearch
                  value={field.value ?? ""}
                  onChange={(val: string) => {
                    field.onChange(val);

                    const phone = matchPhoneCountry(val);
                    if (phone) {
                      setValue("phone_code", phone.code, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setValue("phone_country_id", phone.id, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }}
                  placeholder="Type or select your country"
                  searchType="country"
                />
              )}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="City" error={errors.city?.message} required>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <LocationSearch
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Type or select your city"
                  searchType="city"
                  country={country}
                />
              )}
            />
          </FormFieldWrapper>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper
            label="Studio name"
            error={errors.studio_name?.message}
            required
          >
            <Controller
              control={control}
              name="studio_name"
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="e.g. Black Ink Studio"
                  className="bg-white rounded-xl border-gray-200"
                />
              )}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Studio address"
            error={errors.studio_address?.message}
            required
          >
            <Controller
              control={control}
              name="studio_address"
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="e.g. 123 Main St, Suite 4"
                  className="bg-white rounded-xl border-gray-200"
                />
              )}
            />
          </FormFieldWrapper>
        </div>
      </div>

      <SectionHeader
        icon={Phone}
        title="Contact Details"
        subtitle="How clients reach you"
      />

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper
            label="Email"
            error={errors.email?.message}
            required
          >
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="your@email.com"
                  className="bg-white rounded-xl border-gray-200"
                />
              )}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Phone number"
            error={errors.phone_number?.message}
            required
          >
            <Controller
              control={control}
              name="phone_number"
              render={({ field }) => (
                <PhoneInput
                  code={phoneCode ?? ""}
                  countryId={phoneCountryId ?? ""}
                  number={field.value ?? ""}
                  onCodeChange={(code: string, id: string) => {
                    setValue("phone_code", code, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    setValue("phone_country_id", id, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  onNumberChange={(value: string) => field.onChange(value)}
                />
              )}
            />
          </FormFieldWrapper>
        </div>
      </div>

      <SectionHeader
        icon={Globe}
        title="Social Media"
        subtitle="Instagram is primary — the rest is optional"
      />

      <div className="space-y-4 mb-8">
        <FormFieldWrapper
          label={
            <>
              <span>Instagram </span>
              <span className="text-blue-500">★</span>
            </>
          }
          error={errors.instagram?.message}
          required
        >
          <Controller
            control={control}
            name="instagram"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="https://instagram.com/yourname"
                className="bg-white rounded-xl border-gray-200"
              />
            )}
          />
        </FormFieldWrapper>

        {visibleOptionalSocials.map((social) => (
          <div key={social.key} className="flex items-end gap-2">
            <FormFieldWrapper
              label={social.label}
              error={errors[social.key]?.message}
              styles={{ root: "flex-1" }}
            >
              <Controller
                control={control}
                name={social.key}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder={social.placeholder}
                    className="bg-white rounded-xl border-gray-200"
                  />
                )}
              />
            </FormFieldWrapper>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mb-0.5 h-10 w-10 text-gray-400 hover:text-red-500"
              onClick={() =>
                setValue(social.key, "", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {hiddenOptionalSocials.length > 0 && (
          <FormFieldWrapper label="Add social network">
            <Select
              key={hiddenOptionalSocials.map((s) => s.key).join(",")}
              value=""
              onValueChange={(key) => {
                setValue(key as OptionalSocialKey, " ", {
                  shouldDirty: true,
                  shouldValidate: false,
                });
              }}
            >
              <SelectTrigger className="bg-white rounded-xl border-gray-200 w-full">
                <SelectValue placeholder="Choose a network to add..." />
              </SelectTrigger>
              <SelectContent>
                {hiddenOptionalSocials.map((social) => (
                  <SelectItem key={social.key} value={social.key}>
                    {social.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        )}
      </div>

      <FormFieldWrapper
        label="Studio photo"
        error={errors.image_url?.message}
        styles={{ root: "mb-6" }}
        required
      >
        <Controller
          control={control}
          name="image_url"
          render={({ field }) => (
            <PhotoUploader
              imageUrl={field.value}
              onChange={(v) => field.onChange(v?.imageUrl ?? "")}
            />
          )}
        />
      </FormFieldWrapper>

      <div className="flex justify-center gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="rounded-full px-8 border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          className="rounded-full px-8 bg-blue-500 hover:bg-blue-600 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
        <Icon className="w-4 h-4 text-blue-500" />
      </div>
      <div>
        <p className="font-semibold text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
