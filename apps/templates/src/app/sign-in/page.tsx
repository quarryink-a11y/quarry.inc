"use client";

import adminSigninImage from "@public/images/admin/sign-in/signin-image.png";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { SignInForm } from "@/features/sign-in";
import { useTenantHref } from "@/shared/hooks/use-tenant-href";
import { cn } from "@/shared/lib/utils";

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  prompt: () => void;
}

interface AppleIDAuth {
  init: (config: {
    clientId: string;
    scope: string;
    redirectURI: string;
    state: string;
    usePopup: boolean;
  }) => void;
  signIn: () => Promise<{
    authorization: { id_token: string; code: string };
    user?: { name?: { firstName?: string; lastName?: string } };
  }>;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
    AppleID?: { auth: AppleIDAuth };
  }
}

const generalStyles = {
  shadow_box:
    "pointer-events-none absolute z-0 h-[727px] w-[367px] rotate-[-26.39deg] bg-[linear-gradient(154.27deg,#61C8FF_18.08%,#2F4DF8_93.76%)] opacity-80 blur-[150px] lg:h-[1454px] lg:w-[735px]",
};

export default function AdminSignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { href } = useTenantHref();
  const googleInitialized = useRef(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const getRedirectUrl = () =>
    searchParams.get("callbackUrl") ?? href("/admin");

  const initGoogle = () => {
    if (!window.google || googleInitialized.current) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: (response: { credential: string }) => {
        void (async () => {
          setIsGoogleLoading(true);
          try {
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: response.credential }),
            });

            if (!res.ok) {
              toast.error("Google sign-in failed. Account not found.");
              return;
            }

            toast.success("Signed in successfully!");
            router.push(getRedirectUrl());
            router.refresh();
          } finally {
            setIsGoogleLoading(false);
          }
        })();
      },
    });

    googleInitialized.current = true;
  };

  const handleGoogleClick = () => {
    if (!window.google || !googleInitialized.current) {
      toast.error("Google is not loaded yet. Please try again.");
      return;
    }

    window.google.accounts.id.prompt();
  };

  const handleAppleClick = () => {
    if (!window.AppleID) {
      toast.error("Apple is not loaded yet. Please try again.");
      return;
    }

    void (async () => {
      setIsAppleLoading(true);
      try {
        const response = await window.AppleID!.auth.signIn();

        const res = await fetch("/api/auth/apple", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: response.authorization.id_token,
          }),
        });

        if (!res.ok) {
          toast.error("Apple sign-in failed. Account not found.");
          return;
        }

        toast.success("Signed in successfully!");
        router.push(getRedirectUrl());
        router.refresh();
      } catch (error) {
        console.error("Apple sign-in failed", error);
        toast.error("Apple sign-in was cancelled.");
      } finally {
        setIsAppleLoading(false);
      }
    })();
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogle}
      />

      <Script
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.AppleID?.auth.init({
            clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
            scope: "name email",
            redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
            state: "apple-login",
            usePopup: true,
          });
        }}
      />

      <section className="relative min-h-205 w-screen overflow-hidden bg-[#2F4DF8] px-4 pt-7 lg:min-h-235 lg:px-8 xl:min-h-341.5 xl:pt-22">
        <div className="pointer-events-none absolute top-0 left-0 z-3 h-full w-full bg-[url('/images/admin/sign-in/background-grid.png')] bg-contain bg-center" />
        <div
          className={cn("top-[-300px] left-[20%]", generalStyles.shadow_box)}
        />
        <div
          className={cn("top-[-400px] left-[70%]", generalStyles.shadow_box)}
        />
        <div
          className={`pointer-events-none absolute right-0 bottom-0 z-11 h-[163px] w-full bg-[linear-gradient(180deg,rgba(47,77,248,0.08)_3.47%,rgba(47,77,248,0.8)_100%)] md:h-[263px] xl:h-[563px]`}
        />

        <div className="absolute right-[50%] bottom-0 z-10 flex translate-x-1/2 items-center justify-center pt-20">
          <div className="relative h-[122px] w-[343px] md:h-[222px] md:w-[443px] xl:h-[522px] xl:w-[793px]">
            {Array.from({
              length: 4,
            }).map((_, index) => {
              const widthPercent = 100 - index * 5;
              const topOffset = index * 17;
              const opacity = 100 - index * 10;
              const zIndex = 11 - index;

              return (
                <motion.div
                  key={index}
                  className="pointer-events-none"
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  transition={{
                    delay: Number(index) * 0.3,
                  }}
                >
                  <img
                    alt="Admin Sign-In Decorative"
                    className="absolute left-1/2 block h-auto -translate-x-1/2 duration-300 ease-in-out select-none"
                    src={adminSigninImage.src}
                    style={{
                      width: `${widthPercent}%`,
                      top: `${-topOffset}px`,
                      zIndex: zIndex,
                      opacity: opacity / 100,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <h1 className="w-full max-w-[862px] text-center text-3xl leading-[135%] font-bold text-white capitalize md:text-4xl lg:text-5xl">
            Manage your Tattoo Website
            <br />
            Easily{" "}
            <span className="mb-3 inline-block overflow-hidden rounded-[20px] border border-white bg-white/30 px-3.5 py-[7px] align-middle lg:px-5.5 lg:py-[9px]">
              <div className="lightning-icon">
                <svg
                  className={"h-[25px] w-[20px] lg:h-[32px] lg:w-[27px]"}
                  fill="none"
                  height="32"
                  viewBox="0 0 27 32"
                  width="27"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5364 31.8334C8.75051 31.9457 8.98207 32 9.2114 32C9.62963 32 10.0407 31.8196 10.3246 31.4823L25.8397 13.0581C26.2041 12.6253 26.2846 12.0206 26.046 11.5076C25.8073 10.9947 25.2929 10.6666 24.7272 10.6666H16.7102L22.0756 2.23544C22.3605 1.78753 22.3789 1.21997 22.1235 0.754616C21.868 0.289163 21.3793 0 20.8484 0H12.1212C11.6021 0 11.1224 0.276557 10.8624 0.725719L0.19577 19.1499C-0.0647871 19.5999 -0.0652719 20.1547 0.194412 20.6052C0.454193 21.0557 0.934579 21.3333 1.45453 21.3333H10.2168L7.80874 30.1626C7.62915 30.8213 7.93179 31.5164 8.5364 31.8334Z"
                    fill="white"
                  />
                </svg>
              </div>
            </span>{" "}
            In Minutes
          </h1>
          <p className="mb-[34px] w-full max-w-[540px] max-w-[766px] text-center text-sm leading-[158.7%] font-light tracking-[-0.03em] text-white md:mb-[54px] md:text-2xl md:text-lg lg:mb-[74px] lg:text-xl">
            One simple space for your portfolio, guest spots, reviews, and
            flashes.
          </p>

          <SignInForm
            styles={{
              container: "w-full max-w-[378px]",
            }}
            onGoogleClick={handleGoogleClick}
            onAppleClick={handleAppleClick}
            isGoogleLoading={isGoogleLoading}
            isAppleLoading={isAppleLoading}
          />
        </div>
      </section>
    </>
  );
}
