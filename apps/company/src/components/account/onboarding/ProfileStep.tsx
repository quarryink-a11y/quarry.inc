"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldWrapper } from "@quarry/shared-components";
import { generateSlug } from "@quarry/shared-utils";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Globe,
  Loader2,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import {
  Controller,
  type SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { z } from "zod";

import { LocationSearch } from "@/components/shared/LocationSearch";
import { COUNTRY_CODES, PhoneInput } from "@/components/shared/PhoneInput";
import {
  PhotoUploader,
  type PhotoValue,
} from "@/components/shared/PhotoUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ---------------------------------------------------------------------------
// Country → phone code mapping
// ---------------------------------------------------------------------------

const COUNTRY_NAME_TO_PHONE: Record<string, string> = {
  "united states": "us",
  usa: "us",
  us: "us",
  canada: "ca",
  "united kingdom": "uk",
  uk: "uk",
  "great britain": "uk",
  england: "uk",
  germany: "de",
  deutschland: "de",
  france: "fr",
  italy: "it",
  italia: "it",
  spain: "es",
  españa: "es",
  ukraine: "ua",
  україна: "ua",
  poland: "pl",
  polska: "pl",
  austria: "at",
  österreich: "at",
  "czech republic": "cz",
  czechia: "cz",
  japan: "jp",
  "south korea": "kr",
  korea: "kr",
  australia: "au",
  "united arab emirates": "ae",
  uae: "ae",
  israel: "il",
  turkey: "tr",
  türkiye: "tr",
};

function matchPhoneCountry(
  countryName: string,
): { code: string; id: string } | null {
  if (!countryName) return null;
  const id = COUNTRY_NAME_TO_PHONE[countryName.toLowerCase().trim()];
  if (!id) return null;
  const match = COUNTRY_CODES.find((c) => c.id === id);
  return match ? { code: match.code, id: match.id } : null;
}

// ---------------------------------------------------------------------------
// Social media platforms
// ---------------------------------------------------------------------------

const OPTIONAL_SOCIALS = [
  { key: "telegram", label: "Telegram", placeholder: "@Username" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "Phone number" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@name" },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/page",
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@channel",
  },
] as const;

type OptionalSocialKey = (typeof OPTIONAL_SOCIALS)[number]["key"];

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  // Image fields: publicId for delete, url for backend + display
  profile_image_public_id: z.string().optional(),
  photoUrl: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  studioName: z.string().optional(),
  studioAddress: z.string().optional(),
  email: z
    .union([
      z.literal(""),
      z.string().email({ message: "Invalid email address" }),
    ])
    .optional(),
  // Phone split for UI; combined into `phone` before API call
  phone_code: z.string().optional(),
  phone_country_id: z.string().optional(),
  phone_number: z.string().optional(),
  instagram: z.string().optional(),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  tiktok: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  studio_image_public_id: z.string().optional(),
  studioPhotoUrl: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProfileStepProps {
  onNext: (data: ProfileFormData) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

function SectionHeader({ icon: Icon, title, subtitle }: SectionHeaderProps) {
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

export function ProfileStep({ onNext }: ProfileStepProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      description: "",
      profile_image_public_id: "",
      photoUrl: "",
      country: "",
      city: "",
      studioName: "",
      studioAddress: "",
      email: "",
      phone_code: "+1",
      phone_country_id: "us",
      phone_number: "",
      instagram: "",
      telegram: "",
      whatsapp: "",
      tiktok: "",
      facebook: "",
      youtube: "",
      studio_image_public_id: "",
      studioPhotoUrl: "",
    },
  });

  const fullName = useWatch({ control, name: "fullName" }) ?? "";
  const photoUrl = useWatch({ control, name: "photoUrl" }) ?? "";
  const profileImagePublicId =
    useWatch({ control, name: "profile_image_public_id" }) ?? "";
  const studioPhotoUrl = useWatch({ control, name: "studioPhotoUrl" }) ?? "";
  const studioImagePublicId =
    useWatch({ control, name: "studio_image_public_id" }) ?? "";
  const country = useWatch({ control, name: "country" }) ?? "";
  const description = useWatch({ control, name: "description" }) ?? "";
  const phoneCode = useWatch({ control, name: "phone_code" }) ?? "+1";
  const phoneCountryId =
    useWatch({ control, name: "phone_country_id" }) ?? "us";
  const phoneNumber = useWatch({ control, name: "phone_number" }) ?? "";
  const telegram = useWatch({ control, name: "telegram" }) ?? "";
  const whatsapp = useWatch({ control, name: "whatsapp" }) ?? "";
  const tiktok = useWatch({ control, name: "tiktok" }) ?? "";
  const facebook = useWatch({ control, name: "facebook" }) ?? "";
  const youtube = useWatch({ control, name: "youtube" }) ?? "";

  const socialsMap = { telegram, whatsapp, tiktok, facebook, youtube };

  const visibleOptionalSocials = OPTIONAL_SOCIALS.filter(
    (s) => !!socialsMap[s.key],
  );
  const hiddenOptionalSocials = OPTIONAL_SOCIALS.filter(
    (s) => !socialsMap[s.key],
  );

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    await onNext(data);
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Set up your artist profile
        </h1>
        <p className="text-gray-500 text-sm">
          Fill in your details — this will be shown on your site. You can update
          everything later in Settings.
        </p>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
      >
        {/* ── Artist Profile ── */}
        <SectionHeader
          icon={User}
          title="Artist Profile"
          subtitle="Your name & bio — shown on your site and invoices"
        />

        <div className="flex justify-center">
          <PhotoUploader
            imageUrl={photoUrl}
            publicId={profileImagePublicId}
            onChange={(value: PhotoValue | null) => {
              setValue("profile_image_public_id", value?.publicId ?? "");
              setValue("photoUrl", value?.imageUrl ?? "");
            }}
          />
        </div>

        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Artist full name"
              required
              error={fieldState.error?.message}
            >
              <Input
                {...field}
                placeholder="e.g. Anna Zelenska"
                className="bg-white rounded-xl border-gray-200"
              />
              {fullName.trim() && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
                  <p className="text-xs text-gray-500">Your free domain:</p>
                  <p className="text-sm font-medium text-blue-700">
                    quarry.ink/{generateSlug(fullName)}
                  </p>
                </div>
              )}
            </FormFieldWrapper>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <FormFieldWrapper
              label="Short description"
              error={fieldState.error?.message}
            >
              <Textarea
                {...field}
                value={field.value ?? ""}
                placeholder='e.g. "Tattoo artist who creates small color tattoos inspired by fantasy, anime, and art."'
                maxLength={500}
                className="h-20 resize-none bg-white rounded-xl border-gray-200"
              />
              <p className="text-xs text-gray-400">{description.length}/500</p>
            </FormFieldWrapper>
          )}
        />

        {/* ── Location & Studio ── */}
        <SectionHeader
          icon={MapPin}
          title="Location & Studio"
          subtitle="Where clients can find you"
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="country"
            control={control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Country"
                error={fieldState.error?.message}
              >
                <LocationSearch
                  value={field.value ?? ""}
                  onChange={(val) => {
                    field.onChange(val);
                    const phone = matchPhoneCountry(val);
                    if (phone) {
                      setValue("phone_code", phone.code);
                      setValue("phone_country_id", phone.id);
                    }
                  }}
                  placeholder="Country"
                  searchType="country"
                />
              </FormFieldWrapper>
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper label="City" error={fieldState.error?.message}>
                <LocationSearch
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="City"
                  searchType="city"
                  country={country}
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="studioName"
            control={control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Studio name"
                error={fieldState.error?.message}
              >
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="e.g. Black Ink Studio"
                  className="bg-white rounded-xl border-gray-200"
                />
              </FormFieldWrapper>
            )}
          />
          <Controller
            name="studioAddress"
            control={control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label="Studio address"
                error={fieldState.error?.message}
              >
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="e.g. 123 Main St, Suite 4"
                  className="bg-white rounded-xl border-gray-200"
                />
              </FormFieldWrapper>
            )}
          />
        </div>

        {/* ── Contact Details ── */}
        <SectionHeader
          icon={Phone}
          title="Contact Details"
          subtitle="How clients reach you"
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper label="Email" error={fieldState.error?.message}>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="your@email.com"
                  className="bg-white rounded-xl border-gray-200"
                />
              </FormFieldWrapper>
            )}
          />
          <FormFieldWrapper
            label="Phone number"
            error={errors.phone_number?.message}
          >
            <PhoneInput
              code={phoneCode}
              countryId={phoneCountryId}
              number={phoneNumber}
              onCodeChange={(code, id) => {
                setValue("phone_code", code);
                setValue("phone_country_id", id);
              }}
              onNumberChange={(val) => setValue("phone_number", val)}
            />
          </FormFieldWrapper>
        </div>

        {/* ── Social Media ── */}
        <SectionHeader
          icon={Globe}
          title="Social Media"
          subtitle="Instagram is primary — the rest is optional"
        />

        <div className="space-y-4">
          <Controller
            name="instagram"
            control={control}
            render={({ field, fieldState }) => (
              <FormFieldWrapper
                label={
                  <>
                    Instagram{" "}
                    <span className="text-blue-500 font-normal">★</span>
                  </>
                }
                error={fieldState.error?.message}
              >
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="https://instagram.com/yourname"
                  className="bg-white rounded-xl border-gray-200"
                />
              </FormFieldWrapper>
            )}
          />

          {visibleOptionalSocials.map((social) => (
            <div key={social.key} className="flex items-end gap-2">
              <div className="flex-1">
                <Controller
                  name={social.key}
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormFieldWrapper
                      label={social.label}
                      error={fieldState.error?.message}
                    >
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder={social.placeholder}
                        className="bg-white rounded-xl border-gray-200"
                      />
                    </FormFieldWrapper>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-red-500"
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

        {/* Studio photo */}
        <FormFieldWrapper label="Studio photo">
          <PhotoUploader
            imageUrl={studioPhotoUrl}
            publicId={studioImagePublicId}
            onChange={(value: PhotoValue | null) => {
              setValue("studio_image_public_id", value?.publicId ?? "");
              setValue("studioPhotoUrl", value?.imageUrl ?? "");
            }}
          />
        </FormFieldWrapper>

        {/* Next button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-xl text-base gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving...
            </>
          ) : (
            <>
              Save & Continue <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>

        <p className="text-xs text-gray-400 text-center">
          You can update all of this later in Settings.
        </p>
      </form>
    </div>
  );
}
