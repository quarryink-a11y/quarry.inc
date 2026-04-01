// STATUS: done

"use client";

import type { ContactFormValues } from "@features/contacts/model";
import {
  AdminsTab,
  BillingTab,
  ContactsTab,
  ModulesTab,
} from "@features/settings/ui";
import { Skeleton } from "@shared/components/ui/skeleton";
import { SiteSection } from "@shared/constants/enums";
import { useCompleteModule } from "@shared/hooks/use-complete-module";
import { useProfileMe, useUpdateProfile } from "@shared/hooks/use-owner";
import { useSiteSettings } from "@shared/hooks/use-site-settings";
import { useTenantHref } from "@shared/hooks/use-tenant-href";
import { CreditCard, LayoutGrid, UserCircle, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const tabsList = [
  { id: "contacts", label: "Artist Profile", icon: UserCircle },
  { id: "modules", label: "Modules", icon: LayoutGrid },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "admins", label: "Admins", icon: Users },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const { href } = useTenantHref();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "contacts";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { completeModule } = useCompleteModule();

  const { data: profileMe, isLoading: profileLoading } = useProfileMe();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const { isLoading: settingsLoading } = useSiteSettings();

  const isLoading = profileLoading || settingsLoading;

  const contactInitialValues = useMemo<ContactFormValues | undefined>(() => {
    if (!profileMe?.profile) return undefined;
    const p = profileMe.profile;
    const sm = p.social_media;
    return {
      artist_full_name: p.full_name ?? "",
      short_description: p.description ?? "",
      profile_image_url: p.photo_url ?? "",
      country: p.country ?? "",
      city: p.city ?? "",
      studio_name: p.studio_name ?? "",
      studio_address: p.studio_address ?? "",
      email: p.email ?? "",
      phone_code: "",
      phone_country_id: "",
      phone_number: p.phone ?? "",
      instagram: sm?.INSTAGRAM ?? "",
      telegram: sm?.TELEGRAM ?? "",
      whatsapp: sm?.WHATSAPP ?? "",
      tiktok: sm?.TIKTOK ?? "",
      facebook: sm?.FACEBOOK ?? "",
      youtube: sm?.YOUTUBE ?? "",
      image_url: p.studio_photo_url ?? "",
    };
  }, [profileMe?.profile]);

  const handleSave = async (values: ContactFormValues) => {
    try {
      await updateProfile({
        full_name: values.artist_full_name,
        description: values.short_description ?? null,
        country: values.country ?? null,
        city: values.city ?? null,
        studio_name: values.studio_name ?? null,
        studio_address: values.studio_address ?? null,
        email: values.email ?? null,
        phone: values.phone_number ?? null,
        photo_url: values.profile_image_url ?? null,
        studio_photo_url: values.image_url ?? null,
        social_media: {
          INSTAGRAM: values.instagram ?? null,
          TELEGRAM: values.telegram ?? null,
          WHATSAPP: values.whatsapp ?? null,
          TIKTOK: values.tiktok ?? null,
          FACEBOOK: values.facebook ?? null,
          YOUTUBE: values.youtube ?? null,
        },
      });

      toast.success("Profile saved!");

      const wasCompleted = await completeModule(SiteSection.ARTIST_PROFILE);
      if (wasCompleted) {
        toast.success("Module completed!");
        router.push(href("/admin"));
      }
    } catch {
      toast.error("Failed to save profile");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/80">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-40 mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          {tabsList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {activeTab === "contacts" && contactInitialValues && (
            <ContactsTab
              initialValues={contactInitialValues}
              isPending={isPending}
              handleCancel={() => setActiveTab("contacts")}
              handleSave={handleSave}
            />
          )}
          {activeTab === "modules" && <ModulesTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "admins" && <AdminsTab />}
        </div>
      </div>
    </div>
  );
}
