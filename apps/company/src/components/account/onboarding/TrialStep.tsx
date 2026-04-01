// STATUS: almost-done
// DESCRIPTION: Нужно обработать ошибки, понять почему я не использую handleSubmit
import type { SubscriptionPlan } from "@quarry/api-types/aliases";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { useMutationSetupIntent } from "@/features/stripe-billing/api/use-mutation-setup-intent";
import { useMutationStartTrial } from "@/features/stripe-billing/api/use-mutation-start-trial";
import { StripeProvider } from "@/providers/StripeProvider";

const features = [
  "Full access to all admin features",
  "Custom domain support",
  "Unlimited portfolio uploads",
  "Analytics dashboard",
  "Booking form with email notifications",
  "Online shop & catalog",
];

interface TrialStepProps {
  onBack: () => void;
}

export function TrialStep({ onBack }: TrialStepProps) {
  const { mutateAsync: setupIntent, isPending } = useMutationSetupIntent();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      const result = await setupIntent({
        planCode: "BASIC" as SubscriptionPlan,
      });
      setClientSecret(result.setupIntent.clientSecret);
    }
    void bootstrap();
  }, [setupIntent]);

  if (isPending || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
        <p className="text-gray-500 ml-2">Loading...</p>
      </div>
    );
  }
  return (
    <StripeProvider clientSecret={clientSecret}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to templates
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                You&apos;re almost there!
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Start your 14-day free trial. Add a card to get started.
              </p>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                What&apos;s included:
              </p>
              <div className="flex flex-col gap-2">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Payment details
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Card Form */}
            <TrialStepForm planCode={"BASIC"} clientSecret={clientSecret} />

            <p className="text-xs text-gray-400 text-center mt-4">
              You won&apos;t be charged until the trial ends. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </StripeProvider>
  );
}

function TrialStepForm(props: {
  planCode: SubscriptionPlan;
  billingEmail?: string;
  clientSecret: string;
}) {
  const { clientSecret, planCode, billingEmail } = props;
  const { mutateAsync: startTrial, isPending } = useMutationStartTrial();
  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit() {
    try {
      // Call the onStartTrial prop to start the trial and handle payment
      if (!stripe || !elements || !clientSecret) {
        alert("Stripe has not loaded yet. Please try again in a moment.");
        return;
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error("Elements submit error:", submitError);
        alert(submitError.message ?? "Please check your payment details.");
        return;
      }

      const confirmResult = await stripe.confirmSetup({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/account/onboarding?trial=success`,
        },
        redirect: "if_required",
      });
      if (confirmResult?.error) {
        console.error("Stripe error:", confirmResult.error);
        alert(confirmResult.error.message ?? "Payment failed");
      }

      const paymentMethodId =
        typeof confirmResult.setupIntent?.payment_method === "string"
          ? confirmResult.setupIntent.payment_method
          : null;

      if (!paymentMethodId) {
        console.error("No payment method ID returned from Stripe");
        alert("Payment failed: No payment method ID");
        return;
      }

      await startTrial({
        paymentMethodId,
        planCode: planCode || "BASIC",
        billingEmail,
      });
    } catch (e) {
      console.error("Trial start error:", e);
      alert("An error occurred while starting the trial. Please try again.");
    }
  }

  return (
    <div>
      <PaymentElement />
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 cursor-pointer disabled:bg-gray-400 disabled:hover:bg-gray-400 transition-colors"
        disabled={!stripe || !elements || isPending || !clientSecret}
      >
        {isPending ? "Starting Trial..." : "Start 14-Day Free Trial"}
      </button>
    </div>
  );
}
