// STATUS: done
"use client";

import { AboutForm } from "@features/aboutme/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { sleep } from "@quarry/shared-utils";
import { Button } from "@shared/components/ui/button";
import { SiteSection } from "@shared/constants/enums";
import { useCompleteModule } from "@shared/hooks/use-complete-module";
import { useProfileMe, useUpdateProfile } from "@shared/hooks/use-owner";
import { useSiteMe } from "@shared/hooks/use-site";
import { useTenantHref } from "@shared/hooks/use-tenant-href";
import { ArrowRight, CheckCircle2, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  aboutFormSchema,
  type AboutFormValues,
} from "@/features/aboutme/model";
import { Loader } from "@/shared/components/Loader";

export default function AboutMePage() {
  const router = useRouter();
  const { href } = useTenantHref();
  const { completeModule } = useCompleteModule();
  const { data: profileMe, isLoading } = useProfileMe();
  const { data: siteMe } = useSiteMe();
  const updateProfile = useUpdateProfile();

  const defaultValues = useMemo<AboutFormValues>(() => {
    const p = profileMe?.profile;

    return {
      text: p?.about_text ?? "",
      blocks: (p?.about_blocks ?? []).map((b: Record<string, unknown>) => ({
        title: (b.title as string) ?? "",
        text: (b.text as string) ?? "",
      })),
      photo_url: p?.about_photo_url ?? "",
    };
  }, [profileMe]);

  const methods = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const isOnboarding =
    siteMe?.owner_onboarding_status !== "ONBOARDING_COMPLETED";

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await updateProfile.mutateAsync({
        about_text: formData.text,
        about_blocks: formData.blocks,
        about_photo_url: formData.photo_url,
      });

      toast.success("About section saved!");

      const wasCompleted = await completeModule(SiteSection.ABOUT);
      if (wasCompleted) toast.success("Module completed!");

      await sleep(800);
      router.push(href("/admin"));
    } catch {
      toast.error("Failed to save about section");
    }
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50/80">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">About</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your bio for your website
              </p>
            </div>

            {!isOnboarding && (
              <Button
                onClick={() => void onSubmit()}
                disabled={updateProfile.isPending}
                className="gap-2 rounded-xl bg-blue-500 hover:bg-blue-600"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : updateProfile.isSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <AboutForm />
          </div>

          {isOnboarding && (
            <div className="mt-6">
              <Button
                onClick={() => void onSubmit()}
                disabled={updateProfile.isPending}
                className="h-12 w-full gap-2 rounded-xl bg-blue-500 text-base hover:bg-blue-600"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
