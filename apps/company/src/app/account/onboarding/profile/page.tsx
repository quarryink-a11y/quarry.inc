// STATUS: almost-done
// DESCRIPTION: Мне не нравится как я использую toCompleteProfileDto, хотелось бы сделать это более элегантно. Но в целом логика должна работать, так что можно оставить на потом рефакторинг
"use client";

import type { OnboardingCompleteProfileDto } from "@quarry/api-types/aliases";
import toast from "react-hot-toast";

import {
  type ProfileFormData,
  ProfileStep,
} from "@/components/account/onboarding/ProfileStep";
import { useOnboarding } from "@/features/onboarding/context";

function toCompleteProfileDto(
  data: ProfileFormData,
): OnboardingCompleteProfileDto {
  const phone =
    data.phone_code && data.phone_number
      ? `${data.phone_code}${data.phone_number}`
      : undefined;

  return {
    fullName: data.fullName,
    ...(data.description && { description: data.description }),
    ...(data.country && { country: data.country }),
    ...(data.city && { city: data.city }),
    ...(data.studioName && { studioName: data.studioName }),
    ...(data.studioAddress && { studioAddress: data.studioAddress }),
    ...(phone && { phone }),
    ...(data.email && { email: data.email }),
    socialMedia: {
      INSTAGRAM: data.instagram ?? null,
      TELEGRAM: data.telegram ?? null,
      WHATSAPP: data.whatsapp ?? null,
      TIKTOK: data.tiktok ?? null,
      FACEBOOK: data.facebook ?? null,
      YOUTUBE: data.youtube ?? null,
    },
    ...(data.photoUrl && { photoUrl: data.photoUrl }),
    ...(data.studioPhotoUrl && { studioPhotoUrl: data.studioPhotoUrl }),
  };
}

export default function ProfilePage() {
  const { goNext, api } = useOnboarding();

  async function handleNext(data: ProfileFormData) {
    try {
      await api.completeProfileMutation.mutateAsync(toCompleteProfileDto(data));
      goNext();
    } catch (error) {
      console.error("Failed to complete profile step: ", error);
      toast.error("Failed to complete profile step. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full">
        <ProfileStep onNext={handleNext} />
      </div>
    </div>
  );
}
